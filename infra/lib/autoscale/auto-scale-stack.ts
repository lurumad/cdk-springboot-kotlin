import * as cdk from 'aws-cdk-lib';
import * as scale from 'aws-cdk-lib/aws-applicationautoscaling';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as alb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface AutoScaleStackProps extends cdk.StackProps {
    suffix: string;
    cluster: ecs.Cluster;
    service: ecs.FargateService;
    loadBalancer: alb.ApplicationLoadBalancer;
    targetGroup: alb.ApplicationTargetGroup;
}

export class AutoScaleStack extends cdk.Stack {
    public service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: AutoScaleStackProps) {
        super(scope, id, props);

        const autoscaleRole = new iam.Role(this, 'EcsAutoscaleRole', {
            assumedBy: new iam.ServicePrincipal('application-autoscaling.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });

        const autoscale = new scale.ScalableTarget(this, 'ScalableTarget', {
            serviceNamespace: scale.ServiceNamespace.ECS,
            minCapacity: 1,
            maxCapacity: 2,
            resourceId: `service/${props.cluster.clusterName}/${props.service.serviceName}`,
            scalableDimension: 'ecs:service:DesiredCount',
            role: autoscaleRole,
        });

        autoscale.scaleToTrackMetric('RequestCountPerTarget', {
            targetValue: 50,
            predefinedMetric: scale.PredefinedMetric.ALB_REQUEST_COUNT_PER_TARGET,
            resourceLabel: `${props.loadBalancer.loadBalancerFullName}/${props.targetGroup.targetGroupFullName}`,
        });
    }
}