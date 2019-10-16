import { RangeField } from '@dougrich/uxlib'
import withAttrs from '../src/with-attrs'

export const PixelField = withAttrs({
  max: 1400,
  min: 70,
  step: 5,
  label: 'Image Size'
})(RangeField)
