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
    constructor(scope: Construct, id: string, props: AlbStackProps) {
        super(scope, id, props);

        const lb = new alb.ApplicationLoadBalancer(this, 'alb', {
            vpc: props.vpc,
            loadBalancerName: `alb-${props.suffix}`,
        });

        const listener = lb.addListener('listener', {
            protocol: alb.ApplicationProtocol.HTTP,
        });

        const targetGroup = listener.addTargets('targetGroup', {
            protocol: alb.ApplicationProtocol.HTTP,
            protocolVersion: alb.ApplicationProtocolVersion.HTTP1,
            deregistrationDelay: cdk.Duration.seconds(60),
        });

        targetGroup.addTarget(props.service);
    }
}