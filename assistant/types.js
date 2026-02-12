/**
 * Assistant type definitions (JSDoc) for runtime shape consistency.
 */

/** @typedef {'text' | 'voice' | 'image'} InputMode */

/**
 * @typedef {Object} AssistantInput
 * @property {InputMode} mode
 * @property {string=} text
 * @property {string=} audioUri
 * @property {string=} imageUri
 */

/**
 * @typedef {Object} SeatInfo
 * @property {string} section
 * @property {string} row
 * @property {string} seat
 */

/**
 * @typedef {Object} ParkingInfo
 * @property {string} lot
 * @property {string} spot
 */

/**
 * @typedef {Object} UserSnapshot
 * @property {string} name
 * @property {SeatInfo} seat
 * @property {ParkingInfo} parking
 */

/**
 * @typedef {Object} GameSnapshot
 * @property {string} opponent
 * @property {string} date
 * @property {string} time
 * @property {boolean} isHome
 */

/**
 * @typedef {Object} AppSnapshot
 * @property {string} routeName
 * @property {boolean} isGameDay
 * @property {string} gameDayPhase
 * @property {GameSnapshot=} currentGame
 * @property {GameSnapshot=} nextGame
 * @property {UserSnapshot} user
 * @property {string=} screenHint
 */

/**
 * @typedef {'low' | 'high'} ActionRisk
 */

/**
 * @typedef {Object} AssistantAction
 * @property {string} id
 * @property {string} type
 * @property {Object.<string, any>} payload
 * @property {ActionRisk} risk
 * @property {boolean} requiresConfirmation
 */

/**
 * @typedef {'timeline' | 'route' | 'ticket' | 'news' | 'stats' | 'shop'} CardKind
 */

/**
 * @typedef {Object} AssistantCard
 * @property {CardKind} kind
 * @property {Object.<string, any>} data
 */

/**
 * @typedef {Object} AssistantResponse
 * @property {string} message
 * @property {AssistantCard[]} cards
 * @property {AssistantAction[]} actions
 */

export const INPUT_MODES = ['text', 'voice', 'image'];

export const CARD_KINDS = ['timeline', 'route', 'ticket', 'news', 'stats', 'shop'];
