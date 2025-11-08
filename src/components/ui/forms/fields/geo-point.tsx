import type React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../field';
import { Input } from '../../input';
import { useFieldContext } from '..';
import { TooltipFieldLabel } from '../utils/tooltip-field-label';

export type GeoPointFieldProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
};

type GeoPoint = { lat: number; lng: number };

const GeoPointField = (props: GeoPointFieldProps) => {
  const field = useFieldContext<GeoPoint>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <TooltipFieldLabel
        tooltip={props.tooltip}
        tooltipSide={props.tooltipSide}
      >
        {props.label}
      </TooltipFieldLabel>
      <div className="flex gap-2">
        <Input
          value={field.state.value?.lat ?? ''}
          onChange={(e) => {
            const lat = parseFloat(e.target.value);
            if (!isNaN(lat)) {
              field.handleChange({
                lat,
                lng: field.state.value?.lng ?? 0,
              });
            }
          }}
          placeholder="Latitude"
          type="number"
          step="0.00001"
          disabled
        />
        <Input
          value={field.state.value?.lng ?? ''}
          onChange={(e) => {
            const lng = parseFloat(e.target.value);
            if (!isNaN(lng)) {
              field.handleChange({
                lat: field.state.value?.lat ?? 0,
                lng,
              });
            }
          }}
          placeholder="Longitude"
          type="number"
          step="0.00001"
          disabled
        />
      </div>
      <FieldDescription>{props.description}</FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default GeoPointField;
