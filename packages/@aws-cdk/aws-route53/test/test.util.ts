import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as util from '../lib/util';

export = {
  'throws when zone name ending with a \'.\''(test: Test) {
    test.throws(() => util.validateZoneName('zone.name.'), /trailing dot/);
    test.done();
  },

  'accepts a valid domain name'(test: Test) {
    const domainName = 'amazonaws.com';
    util.validateZoneName(domainName);
    test.done();
  },

  'providedName ending with a dot returns the name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com.';
    const qualified = util.determineFullyQualifiedDomainName(providedName, {
      hostedZoneId: 'fakeId',
      zoneName: 'ignored',
      hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
      stack,
      node: stack.node,
      construct: stack.construct,
    });

    // THEN
    test.equal(qualified, 'test.domain.com.');
    test.done();
  },

  'providedName that matches zoneName returns providedName with a trailing dot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com';
    const qualified = util.determineFullyQualifiedDomainName(providedName, {
      hostedZoneId: 'fakeId',
      zoneName: 'test.domain.com.',
      hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
      stack,
      node: stack.node,
      construct: stack.construct,
    });

    // THEN
    test.equal(qualified, 'test.domain.com.');
    test.done();
  },

  'providedName that ends with zoneName returns providedName with a trailing dot'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test.domain.com';
    const qualified = util.determineFullyQualifiedDomainName(providedName, {
      hostedZoneId: 'fakeId',
      zoneName: 'domain.com.',
      hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
      stack,
      node: stack.node,
      construct: stack.construct,
    });

    // THEN
    test.equal(qualified, 'test.domain.com.');
    test.done();
  },

  'providedName that does not match zoneName concatenates providedName and zoneName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const providedName = 'test';
    const qualified = util.determineFullyQualifiedDomainName(providedName, {
      hostedZoneId: 'fakeId',
      zoneName: 'domain.com.',
      hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
      stack,
      node: stack.node,
      construct: stack.construct,
    });

    // THEN
    test.equal(qualified, 'test.domain.com.');
    test.done();
  },
};
