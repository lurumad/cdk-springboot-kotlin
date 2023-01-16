import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface FargateStackProps extends cdk.StackProps {
    suffix: string;
    ecr: ecr.Repository;
    vpc: ec2.Vpc;
    blueTargetGroup: elb.ApplicationTargetGroup;
    imageTag: String | null;
}

export class FargateStack extends cdk.Stack {
    public cluster: ecs.Cluster;
    public service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: FargateStackProps) {
        super(scope, id, props);

        this.cluster = new ecs.Cluster(this, 'cluster', { vpc: props.vpc });

        const serviceLogGroup = new logs.LogGroup(this, 'ServiceLogGroup', {
            logGroupName: `ServiceLogs-${props.suffix}`,
            retention: logs.RetentionDays.EIGHTEEN_MONTHS,
        });

        const logging = ecs.LogDriver.awsLogs({
            streamPrefix: `${props.suffix}`,
            logGroup: serviceLogGroup,
        });

        const taskRole = new iam.Role(this, 'EcsTaskExecutionRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
            inlinePolicies: {
                Telemetry: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: [
                                'logs:PutLogEvents',
                                'logs:CreateLogGroup',
                                'logs:CreateLogStream',
                                'logs:DescribeLogStreams',
                                'logs:DescribeLogGroups',
                                'cloudwatch:PutMetricData',
                                'xray:PutTraceSegments',
                                'xray:PutTelemetryRecords',
                                'xray:GetSamplingRules',
                                'xray:GetSamplingTargets',
                                'xray:GetSamplingStatisticSummaries',
                            ],
                            resources: ['*'],
                        }),
                    ],
                }),
            },
        });

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'taskDefinition', {
            memoryLimitMiB: 512,
            cpu: 256,
            taskRole,
            executionRole: taskRole,
        });

        const image = props.imageTag ?
            ecs.ContainerImage.fromEcrRepository(props.ecr, 'latest') :
            ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample');

        const container = taskDefinition.addContainer('web', {
            image: image,
            logging,
        });

        container.addPortMappings({
            containerPort: 8080,
        });

        this.service = new ecs.FargateService(this, 'fargate', {
            cluster: this.cluster,
            serviceName: `ecs${props.suffix}`,
            desiredCount: 1,
            taskDefinition: taskDefinition,
            assignPublicIp: false,
            circuitBreaker: {
                rollback: true,
            },
            minHealthyPercent: 100,
            deploymentController: {
                type: ecs.DeploymentControllerType.CODE_DEPLOY,
            },
        });

        props.blueTargetGroup.addTarget(this.service);
    }
}