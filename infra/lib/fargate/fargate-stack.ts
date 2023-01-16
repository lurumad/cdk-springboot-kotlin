import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

interface FargateStackProps extends cdk.StackProps {
    suffix: string;
    ecr: ecr.Repository;
    vpc: ec2.Vpc;
    imageTag: String | null;
}

export class FargateStack extends cdk.Stack {
    public service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: FargateStackProps) {
        super(scope, id, props);

        const cluster = new ecs.Cluster(this, 'cluster', { vpc: props.vpc });

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'taskDefinition', {
            memoryLimitMiB: 512,
            cpu: 256,
        });

        const image = props.imageTag ?
            ecs.ContainerImage.fromEcrRepository(props.ecr, 'latest') :
            ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample');

        const container = taskDefinition.addContainer('web', {
            image: image,
        });

        container.addPortMappings({
            containerPort: 80,
        });

        this.service = new ecs.FargateService(this, 'fargate', {
            cluster: cluster,
            serviceName: `ecs${props.suffix}`,
            desiredCount: 1,
            taskDefinition: taskDefinition,
            assignPublicIp: false,
        });
    }
}