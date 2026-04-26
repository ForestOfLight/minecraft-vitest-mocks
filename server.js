import { vi } from 'vitest'
import { worldDynamicPropertyStore, scheduler } from './utils.js'

export const ScriptEventSource = { Entity: 'Entity', Block: 'Block', Server: 'Server', NPCDialogue: 'NPCDialogue' }
export const CustomCommandSource = { Entity: 'Entity', Block: 'Block', Server: 'Server', NPCDialogue: 'NPCDialogue' }
export const CustomCommandStatus = { Failure: 'Failure', Success: 'Success' }
export const CommandPermissionLevel = {}
export const CustomCommandParamType = {}
export const GameMode = { Adventure: 'Adventure', Creative: 'Creative', Spectator: 'Spectator', Survival: 'Survival' }
export class Entity {
    dimension = world.getDimension('overworld')
    id = 'entity'
    isClimbing = false
    isFalling = false
    isInWater = false
    isOnGround = true
    isSleeping = false
    isSneaking = false
    isSprinting = false
    isSwimming = false
    isValid = true
    localizationKey = ''
    location = { x: 0, y: 64, z: 0 }
    x = 0
    y = 64
    z = 0
    nameTag = ''
    scoreboardIdentity = void 0
    target = void 0
    typeId = 'minecraft:entity'

    addEffect = vi.fn()
    addItem = vi.fn()
    addTag = vi.fn(() => true)
    applyDamage = vi.fn(() => false)
    applyImpulse = vi.fn()
    applyKnockback = vi.fn()
    clearDynamicProperties = vi.fn()
    clearVelocity = vi.fn()
    extinguishFire = vi.fn(() => false)
    getAABB = vi.fn()
    getAllBlocksStandingOn = vi.fn(() => [])
    getBlockFromViewDirection = vi.fn(() => void 0)
    getBlockStandingOn = vi.fn(() => void 0)
    getComponent = vi.fn(() => void 0)
    getComponents = vi.fn(() => [])
    getDynamicProperty = vi.fn()
    getDynamicPropertyIds = vi.fn(() => [])
    getDynamicPropertyTotalByteCount = vi.fn(() => 0)
    getEffect = vi.fn()
    getEffects = vi.fn(() => [])
    getEntitiesFromViewDirection = vi.fn(() => [])
    getHeadLocation = vi.fn(() => ({ x: 0, y: 66, z: 0 }))
    getProperty = vi.fn()
    getRotation = vi.fn(() => ({ x: 0, y: 0 }))
    getTags = vi.fn(() => [])
    getVelocity = vi.fn(() => ({ x: 0, y: 0, z: 0 }))
    getViewDirection = vi.fn(() => ({ x: 0, y: 0, z: 1 }))
    hasComponent = vi.fn(() => false)
    hasTag = vi.fn(() => false)
    kill = vi.fn(() => true)
    lookAt = vi.fn()
    matches = vi.fn(() => false)
    playAnimation = vi.fn()
    remove = vi.fn()
    removeEffect = vi.fn(() => false)
    removeTag = vi.fn(() => false)
    resetProperty = vi.fn()
    runCommand = vi.fn()
    setDynamicProperties = vi.fn()
    setDynamicProperty = vi.fn()
    setOnFire = vi.fn(() => false)
    setProperty = vi.fn()
    setRotation = vi.fn()
    teleport = vi.fn()
    triggerEvent = vi.fn()
    tryTeleport = vi.fn(() => true)
}

export class Player extends Entity {
    camera = {}
    clientSystemInfo = {}
    commandPermissionLevel = void 0
    graphicsMode = {}
    inputInfo = {}
    inputPermissions = {}
    isEmoting = false
    isFlying = false
    isGliding = false
    isJumping = false
    level = 0
    locatorBar = {}
    name = ''
    onScreenDisplay = {}
    partyId = void 0
    playerPermissionLevel = void 0
    selectedSlotIndex = 0
    totalXpNeededForNextLevel = 0
    xpEarnedAtCurrentLevel = 0
    typeId = 'minecraft:player'

    addExperience = vi.fn(() => 0)
    addLevels = vi.fn(() => 0)
    clearPropertyOverridesForEntity = vi.fn()
    eatItem = vi.fn()
    getAimAssist = vi.fn()
    getControlScheme = vi.fn()
    getGameMode = vi.fn(() => GameMode.Survival)
    getItemCooldown = vi.fn(() => 0)
    getSpawnPoint = vi.fn()
    getTotalXp = vi.fn(() => 0)
    playMusic = vi.fn()
    playSound = vi.fn()
    postClientMessage = vi.fn()
    queueMusic = vi.fn()
    removePropertyOverrideForEntity = vi.fn()
    resetLevel = vi.fn()
    sendMessage = vi.fn()
    setControlScheme = vi.fn()
    setGameMode = vi.fn()
    setPropertyOverrideForEntity = vi.fn()
    setSpawnPoint = vi.fn()
    spawnParticle = vi.fn()
    startItemCooldown = vi.fn()
    stopAllSounds = vi.fn()
    stopMusic = vi.fn()
    stopSound = vi.fn()
}

export const Block = class Block {}
export const EntityComponentTypes = {
    Inventory: 'minecraft:inventory',
    Equippable: 'minecraft:equippable',
    Projectile: 'minecraft:projectile',
}
export const ItemComponentTypes = {
    Durability: 'durability',
    Enchantable: 'enchantable',
}
export const Container = class Container {
    #slots

    constructor({ size = 27, items = {} } = {}) {
        this.size = size
        this.isValid = true
        this.containerRules = void 0
        this.#slots = Array.from({ length: size }, (_, i) => items[i] ?? void 0)
    }

    get emptySlotsCount() { return this.#slots.filter(s => s === void 0).length }
    get weight() { return 0 }

    getItem = vi.fn(i => this.#slots[i] ?? void 0)
    setItem = vi.fn((i, item) => { this.#slots[i] = item ?? void 0 })
    getSlot = vi.fn(i => ({
        getItem: () => this.#slots[i] ?? void 0,
        setItem: (item) => { this.#slots[i] = item ?? void 0 },
    }))
    addItem = vi.fn(itemStack => {
        for (let i = 0; i < this.size; i++) {
            if (!this.#slots[i]) {
                this.#slots[i] = itemStack
                return void 0
            }
        }
        return itemStack
    })
    clearAll = vi.fn(() => { this.#slots = Array(this.size).fill(void 0) })
    contains = vi.fn(itemStack => this.#slots.some(s => s?.typeId === itemStack?.typeId))
    find = vi.fn(itemStack => {
        const i = this.#slots.findIndex(s => s?.typeId === itemStack?.typeId)
        return i === -1 ? void 0 : i
    })
    findLast = vi.fn(itemStack => {
        for (let i = this.size - 1; i >= 0; i--) 
            if (this.#slots[i]?.typeId === itemStack?.typeId) return i
        
        return void 0
    })
    firstEmptySlot = vi.fn(() => {
        const i = this.#slots.indexOf(s => s === void 0)
        return i === -1 ? void 0 : i
    })
    firstItem = vi.fn(() => {
        const i = this.#slots.findIndex(slot => slot !== void 0)
        return i === -1 ? void 0 : i
    })
    swapItems = vi.fn((slotA, slotB, otherContainer) => {
        const target = otherContainer ?? this
        const a = this.#slots[slotA]
        const b = target.getItem(slotB)
        this.#slots[slotA] = b ?? void 0
        target.setItem(slotB, a)
    })
    moveItem = vi.fn((fromSlot, toSlot, toContainer) => {
        const item = this.#slots[fromSlot]
        this.#slots[fromSlot] = void 0
        toContainer.setItem(toSlot, item)
    })
    transferItem = vi.fn((fromSlot, toContainer) => {
        const item = this.#slots[fromSlot]
        if (!item) return void 0
        for (let i = 0; i < toContainer.size; i++) {
            if (!toContainer.getItem(i)) {
                this.#slots[fromSlot] = void 0
                toContainer.setItem(i, item)
                return item
            }
        }
        return void 0
    })
}
export const EquipmentSlot = { Body: 'Body', Chest: 'Chest', Feet: 'Feet', Head: 'Head', Legs: 'Legs', Mainhand: 'Mainhand', Offhand: 'Offhand' }
export const DimensionType = class DimensionType {
    typeId = 'minecraft:overworld' 
    
    constructor(typeId = void 0) {
        if (typeId) this.typeId = typeId
    }
}
export const DimensionTypes = { getAll: vi.fn(() => [new DimensionType("minecraft:overworld"), new DimensionType('minecraft:nether'), new DimensionType('minecraft:the_end')]) }
export const TicksPerSecond = 20.0
export const BlockVolume = class BlockVolume {}
export const EntityItemComponent = class EntityItemComponent { get componentId() { return 'minecraft:item' } }
export const StructureSaveMode = { Memory: 'Memory', World: 'World' }

export const system = {
    afterEvents: {
        scriptEventReceive: { subscribe: vi.fn() },
    },
    beforeEvents: {
        shutdown: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        startup: { subscribe: vi.fn() },
    },
    runJob: vi.fn(),
    run: vi.fn(callback => {
        return scheduler.scheduleDelay(callback)
    }),
    runTimeout: vi.fn((callback, tickDelay = 0) => {
        return scheduler.scheduleDelay(callback, tickDelay)
    }),
    runInterval: vi.fn((callback, tickInterval = 0) => {
        return scheduler.scheduleInterval(callback, tickInterval)
    }),
    clearRun: vi.fn(runId => {
        scheduler.delete(runId)
    }),
    currentTick: 0,
}

export const world = {
    beforeEvents: {
        chatSend: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerPlaceBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerBreakBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityRemove: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerLeave: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        explosion: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerInteractWithBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerInteractWithEntity: { subscribe: vi.fn(), unsubscribe: vi.fn() },
    },
    afterEvents: {
        worldLoad: { subscribe: vi.fn(cb => cb()), unsubscribe: vi.fn() },
        entitySpawn: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityRemove: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityDie: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityHitEntity: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityHurt: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityLoad: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        effectAdd: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerInventoryItemChange: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        pistonActivate: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerBreakBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerDimensionChange: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerGameModeChange: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerInteractWithBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerInteractWithEntity: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerJoin: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerLeave: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        playerPlaceBlock: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        pressurePlatePush: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        projectileHitEntity: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        gameRuleChange: { subscribe: vi.fn(), unsubscribe: vi.fn() },
    },
    getDynamicProperty: vi.fn((key) => worldDynamicPropertyStore.get(key)),
    setDynamicProperty: vi.fn((key, value) => worldDynamicPropertyStore.set(key, value)),
    getDynamicPropertyIds: vi.fn(() => [...worldDynamicPropertyStore.getIds()]),
    getDimension: vi.fn((() => {
        const dim = { id: 'minecraft:overworld', runCommand: vi.fn(), fillBlocks: vi.fn(), getEntities: vi.fn(() => []), spawnItem: vi.fn() }
        return () => dim
    })()),
    getPlayers: vi.fn(() => []),
    getEntity: vi.fn(),
    sendMessage: vi.fn(),
    gameRules: {},
    structureManager: {
        get: vi.fn(),
        delete: vi.fn(() => true),
        place: vi.fn(),
        createFromWorld: vi.fn(),
    },
}

export class LocationOutOfWorldBoundariesError extends Error {};
export class LocationInUnloadedChunkError extends Error {};