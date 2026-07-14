/** Standard envelope returned by write Server Actions (create/update/delete). */
export interface ActionStatusResponse {
  /** Whether the action completed successfully. */
  success: boolean;
  /** Human-readable error message surfaced to the client when `success` is false. */
  error?: string;
}

/** Status envelope that additionally carries the created or updated record. */
export interface ActionDataResponse<T> extends ActionStatusResponse {
  /** Payload returned to the caller on success (e.g. the persisted record). */
  data?: T;
}
