import { EventBusEnum } from "../enums/event-bus.enum";

export interface EventBusData {
    type: EventBusEnum;
    payload: unknown;
}