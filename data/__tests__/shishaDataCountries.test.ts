import { describe, expect, it } from 'vitest'

import { isCanonicalCountryName } from '../../lib/utils/countryDisplay'
import type { ShishaFlavor } from '../../types/shisha'
import { shishaData } from '../shishaData'

// data/shishaData.js の country が表記ゆれ (USA / Jordan / U.A.E …) や
// 誤字 (アメリ力合衆国) を含まず、正規表記だけで構成されていることを保証する。
// 取り込み時の正規化 (merge_into_data.py の norm_country) が抜けたら落ちる。
describe('shishaData country field', () => {
  it('uses only canonical, known country names', () => {
    const offenders = new Map<string, number>()
    for (const item of shishaData as ShishaFlavor[]) {
      if (!isCanonicalCountryName(item.country)) {
        offenders.set(item.country, (offenders.get(item.country) ?? 0) + 1)
      }
    }
    expect(Object.fromEntries(offenders)).toEqual({})
  })
})
