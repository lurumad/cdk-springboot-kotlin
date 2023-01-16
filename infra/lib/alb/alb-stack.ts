import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as alb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface AlbStackProps extends cdk.StackProps {
    suffix: string;
    vpc: ec2.Vpc;
    service: ecs.FargateService;
}

export class AlbStack extends cdk.Stack {
    public applicationLoadBalancer: alb.ApplicationLoadBalancer;
    public targetGroup: alb.ApplicationTargetGroup;

    constructor(scope: Construct, id: string, props: AlbStackProps) {
        super(scope, id, props);

        this.applicationLoadBalancer = new alb.ApplicationLoadBalancer(this, 'alb', {
            vpc: props.vpc,
            loadBalancerName: `alb-${props.suffix}`,
        });

        const listener = this.applicationLoadBalancer.addListener('listener', {
            protocol: alb.ApplicationProtocol.HTTP,
        });

        this.targetGroup = listener.addTargets('targetGroup', {
            protocol: alb.ApplicationProtocol.HTTP,
            protocolVersion: alb.ApplicationProtocolVersion.HTTP1,
            deregistrationDelay: cdk.Duration.seconds(60),
        });

        this.targetGroup.addTarget(props.service);
    }
}