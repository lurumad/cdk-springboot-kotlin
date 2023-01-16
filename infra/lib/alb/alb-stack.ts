import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface AlbStackProps extends cdk.StackProps {
    suffix: string;
    vpc: ec2.Vpc;
}

export class AlbStack extends cdk.Stack {
    public applicationLoadBalancer: elb.ApplicationLoadBalancer;
    public prodTargetGroup: elb.ApplicationTargetGroup;
    public testTargetGroup: elb.ApplicationTargetGroup;
    public prodListener: elb.ApplicationListener;
    public testListener: elb.ApplicationListener;

    constructor(scope: Construct, id: string, props: AlbStackProps) {
        super(scope, id, props);

        this.applicationLoadBalancer = new elb.ApplicationLoadBalancer(this, 'alb', {
            vpc: props.vpc,
            loadBalancerName: `alb-${props.suffix}`,
            internetFacing: true,
        });

        this.prodListener = this.applicationLoadBalancer.addListener('ProdListener', {
            protocol: elb.ApplicationProtocol.HTTP,
            port: 80,
        });

        this.prodTargetGroup = this.testListener.addTargets('Prod', {
            protocol: elb.ApplicationProtocol.HTTP,
            protocolVersion: elb.ApplicationProtocolVersion.HTTP1,
            deregistrationDelay: cdk.Duration.seconds(60),
            port: 8080,
        });

        this.testListener = this.applicationLoadBalancer.addListener('TestListener', {
            protocol: elb.ApplicationProtocol.HTTP,
            port: 8080,
        });

        this.testTargetGroup = this.testListener.addTargets('Test', {
            protocol: elb.ApplicationProtocol.HTTP,
            protocolVersion: elb.ApplicationProtocolVersion.HTTP1,
            deregistrationDelay: cdk.Duration.seconds(60),
            port: 8080,
        });
    }
}