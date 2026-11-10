export class HistoryEntity {
  constructor({
    id,
    titleKey,
    type,
    messageKey,
    timestamp,
    severity,
    location,
    sensor,
    isResolved,
    actionsTakenKeys,
  }) {
    this.id = id;
    this.titleKey = titleKey;
    this.type = type;
    this.messageKey = messageKey;
    this.timestamp = timestamp ? new Date(timestamp) : new Date();
    this.severity = severity || 'Info';
    this.location = location || '';
    this.sensor = sensor || '';
    this.isResolved = isResolved ?? true;
    this.actionsTakenKeys = actionsTakenKeys || [];
  }

  static fromResource(resource) {
    return new HistoryEntity({
      id: resource.id,
      titleKey: resource.titleKey || resource.title || 'history.events.event1.title',
      type: resource.type || 'User Action',
      messageKey: resource.messageKey || resource.message || 'history.events.event1.message',
      timestamp: resource.created_at || resource.timestamp,
      severity: resource.severity_level || resource.severity,
      location: resource.location_name || resource.location,
      sensor: resource.sensor_code || resource.sensor,
      isResolved: resource.is_resolved ?? resource.isResolved,
      actionsTakenKeys: resource.actionsTakenKeys || [],
    });
  }
}
