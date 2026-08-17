import { vi, beforeEach } from 'vitest'
import { world, resetWorldState } from '@minecraft/server'
import { scheduler, worldDynamicPropertyStore } from './utils.js'

beforeEach(() => {
    vi.resetAllMocks()
    scheduler.reset()
    resetWorldState()
    worldDynamicPropertyStore.clear()
    world.getDynamicProperty.mockImplementation((key) => worldDynamicPropertyStore.get(key))
    world.setDynamicProperty.mockImplementation((key, value) => worldDynamicPropertyStore.set(key, value))
    world.getDynamicPropertyIds.mockImplementation(() => [...worldDynamicPropertyStore.getIds()])
})