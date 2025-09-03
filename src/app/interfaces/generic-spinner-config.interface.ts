import { GenericSpinnerColor } from "../enums/generic-spinner-color.enum";
import { GenericSpinnerMode } from "../enums/generic-spinner-mode.enum";

export interface GenericSpinnerConfig {
  color: GenericSpinnerColor | string;
  mode: GenericSpinnerMode | any;
  value?: number;
  disableLoadingContainer?: boolean;
}