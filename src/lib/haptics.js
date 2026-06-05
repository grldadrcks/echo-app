import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function tapLight() {
  try { await Haptics.impact({ style: ImpactStyle.Light }) } catch {}
}

export async function tapMedium() {
  try { await Haptics.impact({ style: ImpactStyle.Medium }) } catch {}
}

export async function tapHeavy() {
  try { await Haptics.impact({ style: ImpactStyle.Heavy }) } catch {}
}
