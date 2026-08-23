import { vi } from 'vitest'
import { worldDynamicPropertyStore, scheduler } from './utils.js'

export const ScriptEventSource = { Entity: 'Entity', Block: 'Block', Server: 'Server', NPCDialogue: 'NPCDialogue' }
export const CustomCommandSource = { Entity: 'Entity', Block: 'Block', Server: 'Server', NPCDialogue: 'NPCDialogue' }
export const CustomCommandStatus = { Failure: 'Failure', Success: 'Success' }
export const CommandPermissionLevel = {}
export const CustomCommandParamType = {
    BlockType: 'BlockType',
    Boolean: 'Boolean',
    EntitySelector: 'EntitySelector',
    EntityType: 'EntityType',
    Enum: 'Enum',
    Float: 'Float',
    Integer: 'Integer',
    ItemType: 'ItemType',
    Location: 'Location',
    PlayerSelector: 'PlayerSelector',
    String: 'String'
}
export const GameMode = { Adventure: 'Adventure', Creative: 'Creative', Spectator: 'Spectator', Survival: 'Survival' }
export const InputButton = { Jump: 'Jump', Sneak: 'Sneak' }
export const ButtonState = { Pressed: 'Pressed', Released: 'Released' }
export const StructureMirrorAxis = { X: 'X', Z: 'Z', XZ: 'XZ' }
export const StructureRotation = { None: 'None', Rotate90: 'Rotate90', Rotate180: 'Rotate 180', Rotate270: 'Rotate270' }

export class Dimension {
    id;
    #entities = [];

    constructor(id = "minecraft:overworld") {
        this.id = id;
    }

    runCommand = vi.fn();
    fillBlocks = vi.fn();
    getPlayers = vi.fn(() => []);
    getEntities = vi.fn((options = {}) => this.#entities.filter(entity =>
        (options.type === void 0 || entity.typeId === options.type) &&
        (options.tags === void 0 || options.tags.every(tag => entity.getTags().includes(tag))) &&
        (options.families === void 0 || options.families.every(family => (entity.typeFamilies ?? []).includes(family))) &&
        (options.excludeFamilies === void 0 || !options.excludeFamilies.some(family => (entity.typeFamilies ?? []).includes(family)))
    ));
    spawnEntity = vi.fn((typeId, location = { x: 0, y: 0, z: 0 }) => {
        const entity = new Entity();
        entity.typeId = typeId;
        entity.location = location;
        entity.dimension = this;
        entity.remove.mockImplementation(() => this.removeEntity(entity));
        this.#entities.push(entity);
        return entity;
    });
    addEntity = vi.fn(entity => {
        if (!this.#entities.includes(entity))
            this.#entities.push(entity);
    });
    removeEntity = vi.fn(entity => {
        const index = this.#entities.indexOf(entity);
        if (index !== -1)
            this.#entities.splice(index, 1);
    });
    spawnItem = vi.fn();
    spawnParticle = vi.fn();
    heightRange = { min: -64, max: 312 };
    isChunkLoaded = () => true
}

const dimensions = new Map()
const structures = new Map()

function normalizeDimensionId(id) {
    return id.startsWith('minecraft:') ? id : `minecraft:${id}`
}

export function resetWorldState() {
    dimensions.clear()
    structures.clear()
}

export class Entity {
    #rotation = { x: 0, z: 0 };
    #tags = [];
    #container;
    #equipment = new Map();
    #equippable;

    dimension = world.getDimension('minecraft:overworld')
    id = "1"
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
    typeFamilies = []
    typeId = 'minecraft:entity'

    addEffect = vi.fn()
    addItem = vi.fn()
    addTag = vi.fn(tag => {
        if (this.#tags.includes(tag)) return false
        this.#tags.push(tag)
        return true
    })
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
    getComponent = vi.fn(type => {
        if (type === EntityComponentTypes.Inventory) {
            this.#container ??= new Container({ size: 256 })
            return { container: this.#container }
        }
        if (type === EntityComponentTypes.Equippable) {
            this.#equippable ??= {
                getEquipment: vi.fn(equipmentSlot => this.#equipment.get(equipmentSlot)),
                setEquipment: vi.fn((equipmentSlot, itemStack) => {
                    if (itemStack === void 0) this.#equipment.delete(equipmentSlot)
                    else this.#equipment.set(equipmentSlot, itemStack)
                    return true
                }),
                getEquipmentSlot: vi.fn(equipmentSlot => ({
                    getItem: () => this.#equipment.get(equipmentSlot),
                    setItem: itemStack => {
                        if (itemStack === void 0) this.#equipment.delete(equipmentSlot)
                        else this.#equipment.set(equipmentSlot, itemStack)
                    }
                }))
            }
            return this.#equippable
        }
        if (type === EntityComponentTypes.TypeFamily) {
            return {
                getTypeFamilies: vi.fn(() => [...this.typeFamilies]),
                hasTypeFamily: vi.fn(family => this.typeFamilies.includes(family))
            }
        }
        return void 0
    })
    getComponents = vi.fn(() => [])
    getDynamicProperty = vi.fn()
    getDynamicPropertyIds = vi.fn(() => [])
    getDynamicPropertyTotalByteCount = vi.fn(() => 0)
    getEffect = vi.fn()
    getEffects = vi.fn(() => [])
    getEntitiesFromViewDirection = vi.fn(() => [])
    getHeadLocation = vi.fn(() => ({ x: 0, y: 66, z: 0 }))
    getProperty = vi.fn()
    getRotation = vi.fn(() => this.#rotation)
    getTags = vi.fn(() => [...this.#tags])
    getVelocity = vi.fn(() => ({ x: 0, y: 0, z: 0 }))
    getViewDirection = vi.fn(() => ({ x: 0, y: 0, z: 1 }))
    hasComponent = vi.fn(() => false)
    hasTag = vi.fn(tag => this.#tags.includes(tag))
    kill = vi.fn(() => true)
    lookAt = vi.fn()
    matches = vi.fn(() => false)
    playAnimation = vi.fn()
    remove = vi.fn()
    removeEffect = vi.fn(() => false)
    removeTag = vi.fn(tag => {
        const index = this.#tags.indexOf(tag)
        if (index === -1) return false
        this.#tags.splice(index, 1)
        return true
    })
    resetProperty = vi.fn()
    runCommand = vi.fn()
    setDynamicProperties = vi.fn()
    setDynamicProperty = vi.fn()
    setOnFire = vi.fn(() => false)
    setProperty = vi.fn()
    setRotation = vi.fn((rotation) => this.#rotation)
    teleport = vi.fn((location, teleportOptions = {}) => {
        this.location = location;
        if (teleportOptions.dimension !== void 0)
            this.dimension = teleportOptions.dimension;
        if (teleportOptions.rotation !== void 0)
            this.setRotation(teleportOptions.rotation);
    });
    triggerEvent = vi.fn()
    tryTeleport = vi.fn(() => true)
}

export class Player extends Entity {
    camera = {}
    clientSystemInfo = {}
    commandPermissionLevel = void 0
    graphicsMode = {}
    inputInfo = { getButtonState: vi.fn(() => ButtonState.Released) }
    inputPermissions = {}
    isEmoting = false
    isFlying = false
    isGliding = false
    isJumping = false
    level = 0
    locatorBar = {}
    name = ''
    onScreenDisplay = {
        isValid: true,
        getHiddenHudElements: vi.fn(() => []),
        hideAllExcept: vi.fn(),
        isForcedHidden: vi.fn(() => false),
        resetHudElementsVisibility: vi.fn(),
        setActionBar: vi.fn(),
        setHudVisibility: vi.fn(),
        setTitle: vi.fn(),
        updateSubtitle: vi.fn()
    }
    partyId = void 0
    playerPermissionLevel = void 0
    selectedSlotIndex = 0
    totalXpNeededForNextLevel = 0
    xpEarnedAtCurrentLevel = 0
    fogSettings = {}
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
    AddRider: 'minecraft:addrider',
    Ageable: 'minecraft:ageable',
    Breathable: 'minecraft:breathable',
    CanClimb: 'minecraft:can_climb',
    CanFly: 'minecraft:can_fly',
    CanPowerJump: 'minecraft:can_power_jump',
    Color: 'minecraft:color',
    Color2: 'minecraft:color2',
    CursorInventory: 'minecraft:cursor_inventory',
    EnderInventory: 'minecraft:ender_inventory',
    Equippable: 'minecraft:equippable',
    FireImmune: 'minecraft:fire_immune',
    FloatsInLiquid: 'minecraft:floats_in_liquid',
    FlyingSpeed: 'minecraft:flying_speed',
    FrictionModifier: 'minecraft:friction_modifier',
    Healable: 'minecraft:healable',
    Health: 'minecraft:health',
    Inventory: 'minecraft:inventory',
    IsBaby: 'minecraft:is_baby',
    IsCharged: 'minecraft:is_charged',
    IsChested: 'minecraft:is_chested',
    IsDyeable: 'minecraft:is_dyeable',
    IsHiddenWhenInvisible: 'minecraft:is_hidden_when_invisible',
    IsIgnited: 'minecraft:is_ignited',
    IsIllagerCaptain: 'minecraft:is_illager_captain',
    IsSaddled: 'minecraft:is_saddled',
    IsShaking: 'minecraft:is_shaking',
    IsSheared: 'minecraft:is_sheared',
    IsStackable: 'minecraft:is_stackable',
    IsStunned: 'minecraft:is_stunned',
    IsTamed: 'minecraft:is_tamed',
    Item: 'minecraft:item',
    LavaMovement: 'minecraft:lava_movement',
    Leashable: 'minecraft:leashable',
    MarkVariant: 'minecraft:mark_variant',
    Movement: 'minecraft:movement',
    MovementAmphibious: 'minecraft:movement.amphibious',
    MovementBasic: 'minecraft:movement.basic',
    MovementFly: 'minecraft:movement.fly',
    MovementGeneric: 'minecraft:movement.generic',
    MovementGlide: 'minecraft:movement.glide',
    MovementHover: 'minecraft:movement.hover',
    MovementJump: 'minecraft:movement.jump',
    MovementSkip: 'minecraft:movement.skip',
    MovementSway: 'minecraft:movement.sway',
    NavigationClimb: 'minecraft:navigation.climb',
    NavigationFloat: 'minecraft:navigation.float',
    NavigationFly: 'minecraft:navigation.fly',
    NavigationGeneric: 'minecraft:navigation.generic',
    NavigationHover: 'minecraft:navigation.hover',
    NavigationWalk: 'minecraft:navigation.walk',
    Npc: 'minecraft:npc',
    OnFire: 'minecraft:onfire',
    Exhaustion: 'minecraft:player.exhaustion',
    Hunger: 'minecraft:player.hunger',
    Saturation: 'minecraft:player.saturation',
    Projectile: 'minecraft:projectile',
    PushThrough: 'minecraft:push_through',
    Rideable: 'minecraft:rideable',
    Riding: 'minecraft:riding',
    Scale: 'minecraft:scale',
    SkinId: 'minecraft:skin_id',
    Strength: 'minecraft:strength',
    Tameable: 'minecraft:tameable',
    TameMount: 'minecraft:tamemount',
    TypeFamily: 'minecraft:type_family',
    UnderwaterMovement: 'minecraft:underwater_movement',
    Variant: 'minecraft:variant',
    WantsJockey: 'minecraft:wants_jockey',
}
export const ItemComponentTypes = {
    BlockDynamicProperties: 'minecraft:block_actor_dynamic_properties',
    Book: 'minecraft:book',
    Compostable: 'minecraft:compostable',
    Cooldown: 'minecraft:cooldown',
    Durability: 'minecraft:durability',
    Dyeable: 'minecraft:dyeable',
    Enchantable: 'minecraft:enchantable',
    Food: 'minecraft:food',
    Inventory: 'minecraft:inventory',
    Potion: 'minecraft:potion',
}
export const ItemLockMode = { inventory: 'inventory', none: 'none', slot: 'slot' }
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
export class ItemStack {
    #dynamicProperties = new Map()
    #lore = []
    #tags = []

    constructor(itemType, amount = 1) {
        this.typeId = typeof itemType === 'string' ? itemType : itemType?.id
        this.amount = amount
        this.nameTag = void 0
        this.keepOnDeath = false
        this.lockMode = ItemLockMode.none
        this.maxAmount = 64
        this.weight = 0
    }

    get isStackable() { return this.maxAmount > 1 }
    get localizationKey() { return `item.${this.typeId?.replace('minecraft:', '')}.name` }

    clone = vi.fn(() => {
        const clone = new ItemStack(this.typeId, this.amount)
        clone.nameTag = this.nameTag
        clone.keepOnDeath = this.keepOnDeath
        clone.lockMode = this.lockMode
        clone.maxAmount = this.maxAmount
        clone.setLore([...this.#lore])
        return clone
    })
    clearDynamicProperties = vi.fn(() => this.#dynamicProperties.clear())
    getCanDestroy = vi.fn(() => [])
    getCanPlaceOn = vi.fn(() => [])
    getComponent = vi.fn(() => void 0)
    getComponents = vi.fn(() => [])
    getDynamicProperty = vi.fn(identifier => this.#dynamicProperties.get(identifier))
    getDynamicPropertyIds = vi.fn(() => [...this.#dynamicProperties.keys()])
    getDynamicPropertyTotalByteCount = vi.fn(() => 0)
    getLore = vi.fn(() => [...this.#lore])
    getRawLore = vi.fn(() => [])
    getTags = vi.fn(() => [...this.#tags])
    hasComponent = vi.fn(() => false)
    hasTag = vi.fn(tag => this.#tags.includes(tag))
    isStackableWith = vi.fn(itemStack => this.isStackable
        && itemStack?.typeId === this.typeId
        && itemStack?.nameTag === this.nameTag)
    matches = vi.fn(itemName => itemName === this.typeId)
    setCanDestroy = vi.fn()
    setCanPlaceOn = vi.fn()
    setDynamicProperties = vi.fn(values => {
        Object.entries(values ?? {}).forEach(([identifier, value]) => this.setDynamicProperty(identifier, value))
    })
    setDynamicProperty = vi.fn((identifier, value) => {
        if (value === void 0) this.#dynamicProperties.delete(identifier)
        else this.#dynamicProperties.set(identifier, value)
    })
    setLore = vi.fn((loreList = []) => { this.#lore = [...loreList] })
}
export const EquipmentSlot = { Body: 'Body', Chest: 'Chest', Feet: 'Feet', Head: 'Head', Legs: 'Legs', Mainhand: 'Mainhand', Offhand: 'Offhand' }
export const DimensionType = class DimensionType {
    typeId = 'minecraft:overworld' 
    
    constructor(typeId = void 0) {
        if (typeId) this.typeId = typeId
    }
}
export const DimensionTypes = {
    getAll: vi.fn(() => [new DimensionType("minecraft:overworld"), new DimensionType('minecraft:nether'), new DimensionType('minecraft:the_end')]),
    get: vi.fn((dimensionTypeId) => {
        if (dimensionTypeId.includes('overworld'))
            return new DimensionType("minecraft:overworld");
        if (dimensionTypeId.includes('nether'))
            return new DimensionType("minecraft:nether");
        if (dimensionTypeId.includes('the_end'))
            return new DimensionType("minecraft:the_end");
        return void 0;
    })
}
export const TicksPerSecond = 20.0
export const BlockVolume = class BlockVolume {
    getMin() { return { x: 0, y: 0, z: 0 } }
    getMax() { return { x: 0, y: 0, z: 0 } }
}
export const EntityItemComponent = class EntityItemComponent { get componentId() { return 'minecraft:item' } }
export const StructureSaveMode = { Memory: 'Memory', World: 'World' }

export const startupEvent = {
    blockComponentRegistry: vi.fn(),
    itemComponentRegistry: vi.fn(),
    customCommandRegistry: {
        registerCommand: vi.fn(),
        registerEnum: vi.fn()
    },
    dimensionRegistry: {
        registerCustomDimension: vi.fn()
    }
}

export const system = {
    afterEvents: {
        scriptEventReceive: { subscribe: vi.fn() },
    },
    beforeEvents: {
        shutdown: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        startup: { subscribe: vi.fn(), unsubscribe: vi.fn() },
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
    currentTick: 0
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
        entityContainerOpened: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityContainerClosed: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityDie: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityHitEntity: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityHurt: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityLoad: { subscribe: vi.fn(), unsubscribe: vi.fn() },
        entityTamed: { subscribe: vi.fn(), unsubscribe: vi.fn() },
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
    getDimension: vi.fn((id = 'minecraft:overworld') => {
        const dimensionId = normalizeDimensionId(id)
        if (!dimensions.has(dimensionId))
            dimensions.set(dimensionId, new Dimension(dimensionId))
        return dimensions.get(dimensionId)
    }),
    getPlayers: vi.fn(() => []),
    getAllPlayers: vi.fn(() => []),
    getEntity: vi.fn(),
    sendMessage: vi.fn(),
    gameRules: {},
    structureManager: {
        get: vi.fn(id => structures.has(id) ? { id } : void 0),
        delete: vi.fn(id => structures.delete(id)),
        place: vi.fn((id, dimension) => {
            if (!structures.has(id))
                throw new InvalidStructureError(`Structure ${id} does not exist.`)
            for (const entity of structures.get(id))
                dimension.addEntity(entity)
        }),
        createFromWorld: vi.fn((id, dimension) => {
            structures.set(id, dimension.getEntities())
            return { id }
        }),
        getWorldStructureIds: vi.fn(() => [...structures.keys()])
    },
    tickingAreaManager: {
        createTickingArea: vi.fn(() => Promise.resolve()),
        removeTickingArea: vi.fn(() => true),
        hasTickingArea: vi.fn(() => false)
    },
    getPackSettings: vi.fn(() => {})
}

export class InvalidStructureError extends Error {};
export class LocationOutOfWorldBoundariesError extends Error {};
export class LocationInUnloadedChunkError extends Error {};

export class MolangVariableMap {
    setFloat = vi.fn();
    setColorRGBA = vi.fn();
    setVector3 = vi.fn();
}

export class BlockPermutation {
    constructor(id = 'minecraft:air', states = {}) {
        this.type = { id };
        this._states = states;
    }

    getAllStates = vi.fn(() => this._states);
    getState = vi.fn((name) => this._states[name]);

    static resolve = vi.fn((id, states = {}) => new BlockPermutation(id, states));
}