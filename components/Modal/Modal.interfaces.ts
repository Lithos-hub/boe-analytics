import type { Component } from 'vue';

export type ModalContentType = 'StopFetch';

export interface ModalComponentTypes {
  [key: string]: Component;
}
