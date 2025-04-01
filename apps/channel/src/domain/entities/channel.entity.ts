import { AggregateRoot } from '@nestjs/cqrs';
import { ChannelSettings } from '../value-objects/channel-settings';
import { DefaultChannelSettings } from '../value-objects/channel-setting-default';
import { ChannelCreatedEvent } from '../events/channel-created.event';

export class Channel extends AggregateRoot {
  constructor(
    private _id: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    private readonly _account: string,
    private _title: string,
    private _url: string,
    private readonly _token: string,
    private _isEnabled: boolean,
    private _users: string[],
    private readonly _settings: ChannelSettings,
  ) {
    super();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get account() {
    return this._account;
  }

  get title() {
    return this._title;
  }

  get url() {
    return this._url;
  }

  get token() {
    return this._token;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get users() {
    return this._users;
  }

  get settings() {
    return this._settings;
  }

  // Factory method
  static create(
    id: string,
    owner: string,
    title: string,
    url: string,
    token: string,
    users: string[],
  ) {
    const channel = new Channel(
      id,
      new Date(),
      new Date(),
      owner,
      title,
      url,
      token,
      true,
      users,
      DefaultChannelSettings,
    );

    channel.apply(new ChannelCreatedEvent(channel.id));

    return channel;
  }

  updateUsers(userIds: string[]): void {
    this._users = userIds;
    this._updatedAt = new Date();
    return;
  }
}
