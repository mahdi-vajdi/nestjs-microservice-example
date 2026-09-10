import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import type { JsMsg } from 'nats';

type JetStreamContextArgs = [JsMsg];

export class JetStreamContext extends BaseRpcContext<JetStreamContextArgs> {
  constructor(args: JetStreamContextArgs) {
    super(args);
  }

  /**
   * Returns the original JetStream message, allowing manual acks.
   */
  get message(): JsMsg {
    return this.args[0];
  }
}
