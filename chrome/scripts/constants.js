/**
 * The object to access the API functions of the browser.
 * @constant
 * @type {{runtime: object, i18n: object}} BrowserAPI
 */
const brw = chrome;

/**
 * @constant
 * @type {{
 *  patterns: Array.<{
 *      name: string,
 *      className: string,
 *      detectionFunctions: Array.<Function>,
 *      infoUrl: string,
 *      info: string,
 *      languages: Array.<string>
 *  }>
 * }}
 */
export const patternConfig = {
    patterns: [
        {
            name: brw.i18n.getMessage("patternCountdown_name"),
            className: "countdown",
            detectionFunctions: [
                function (node, nodeOld) {
                    if (nodeOld && node.innerText != nodeOld.innerText) {
                        // Updated regular expression to match both formats
                        const reg = /(?:\d{1,2}\s*:\s*\d{1,2}\s*:\s*\d{1,2})|(?:\d{1,2}\s*H\s*:\s*\d{1,2}\s*M\s*:\s*\d{1,2}\s*S)/gi;
        
                        const regBad = /(?:\d{1,2}\s*:\s*){4,}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){5,}/gi;
        
                        let matchesOld = nodeOld.innerText.replace(regBad, "").match(reg);
                        let matchesNew = node.innerText.replace(regBad, "").match(reg);
        
                        if (matchesNew == null || matchesOld == null || (matchesNew != null && matchesOld != null && matchesNew.length != matchesOld.length)) {
                            return false;
                        }
        
                        for (let i = 0; i < matchesNew.length; i++) {
                            let numbersNew = matchesNew[i].match(/\d+/gi);
                            let numbersOld = matchesOld[i].match(/\d+/gi);
        
                            if (numbersNew.length != numbersOld.length) {
                                continue;
                            }
        
                            for (let x = 0; x < numbersNew.length; x++) {
                                if (parseInt(numbersNew[x]) > parseInt(numbersOld[x])) {
                                    break;
                                }
                                if (parseInt(numbersNew[x]) < parseInt(numbersOld[x])) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            ],
            infoUrl: brw.i18n.getMessage("patternCountdown_infoUrl"),
            info: brw.i18n.getMessage("patternCountdown_info"),
            languages: [
                "en",
                "de"
            ]
        },        
        {
            name: brw.i18n.getMessage("patternScarcity_name"),
            className: "scarcity",
            detectionFunctions: [
                // Keywords for scarcity detection
                function (node, nodeOld) {
                    return /\d+\s*(?:\%|pieces?|pcs\.?|pc\.?|ct\.?|items?)?\s*(?:available|sold|claimed|redeemed)|(?:last|final)\s*(?:article|item)/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /\d+\s*(?:\%|stücke?|stk\.?)?\s*(?:verfügbar|verkauft|eingelöst)|letzter\s*Artikel/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /hurry\s*,\s*only\s*\d+\s*(?:stocks?|left)/i.test(node.innerText);
                },
                // Additional scarcity-related keywords
                function (node, nodeOld) {
                    return /limited\s*time/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /exclusive\s*offer/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /low\s*stock/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /selling\s*out\s*fast/i.test(node.innerText);
                },
            ],
            infoUrl: brw.i18n.getMessage("patternScarcity_infoUrl"),
            info: brw.i18n.getMessage("patternScarcity_info"),
            languages: [
                "en",
                "de"
            ]
        },        
        {
            name: brw.i18n.getMessage("patternSocialProof_name"),
            className: "social-proof",
            detectionFunctions: [
                function (node, nodeOld) {
                    return /\d+\s*(?:other)?\s*(?:customers?|clients?|buyers?|users?|shoppers?|purchasers?|people)\s*(?:have\s+)?\s*(?:(?:also\s*)?(?:bought|purchased|ordered)|(?:rated|reviewed))\s*(?:this|the\s*following)\s*(?:product|article|item)s?|\d+\s*(?:customers?|buyers?)\s*(?:have\s*)?(?:bought|purchased)/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    return /\d+\s*(?:andere)?\s*(?:Kunden?|Käufer|Besteller|Nutzer|Leute|Person(?:en)?)(?:(?:\s*\/\s*)?[_\-\*]?innen)?\s*(?:(?:kauften|bestellten|haben)\s*(?:auch|ebenfalls)?|(?:bewerteten|rezensierten))\s*(?:diese[ns]?|(?:den|die|das)?\s*folgenden?)\s*(?:Produkte?|Artikel)|\d+\s*(?:Kunden?|Käufer)\s*(?:haben\s*)?(?:gekauft|bestellt)/i.test(node.innerText);
                },
                function (node, nodeOld) {
                    // New detection function for "X+ bought in the past month"
                    return /\b\d+\+\s*(?:bought|purchased)\s*(?:in\s*the\s*past\s*month)\b/i.test(node.innerText);
                }
            ],
            infoUrl: brw.i18n.getMessage("patternSocialProof_infoUrl"),
            info: brw.i18n.getMessage("patternSocialProof_info"),
            languages: [
                "en",
                "de"
            ]
        },        
        {
            name: brw.i18n.getMessage("patternTrickWording_name"),
            className: "trick-wording",
            detectionFunctions: [
                function (node, nodeOld) {
                    // Updated regular expression to include "FAQ" as trick wording
                    return /\b(?:T&C)\b/i.test(node.innerText);
                }
            ],
            infoUrl: brw.i18n.getMessage("patternTrickWording_infoUrl"),
            info: brw.i18n.getMessage("patternTrickWording_info"),
            languages: [
                "en",
                "de"
            ]
        },        
        {
            name: brw.i18n.getMessage("patternHardToCancel_name"),
            className: "hard-to-cancel",
            detectionFunctions: [
                function (node, nodeOld) {
                    // Regular expression to match cancel-related words
                    const cancelRegex = /\b(?:cancel|cancellation|returns|return)s?\b/i;
        
                    // Check if the text content of the node matches the cancel regex
                    return cancelRegex.test(node.innerText);
                },
                function (node, nodeOld) {
                    // Regular expression to match cancel-related words with uppercase first letters
                    const uppercaseCancelRegex = /\b(?:Cancel|Cancellation|Returns|Return)s?\b/i;
        
                    // Check if the text content of the node matches the uppercase cancel regex
                    return uppercaseCancelRegex.test(node.innerText);
                }
            ],
            infoUrl: brw.i18n.getMessage("patternHardToCancel_infoUrl"),
            info: brw.i18n.getMessage("patternHardToCancel_info"),
            languages: [
                "en",
                "de"
            ]
        },                        
        {
            name: brw.i18n.getMessage("patternForcedContinuity_name"),
            className: "forced-continuity",
            detectionFunctions: [
                function (node, nodeOld) {
                    if (/(?:(?:€|EUR|GBP|£|\$|USD|₹|INR)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|EUR|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?|₹|INR))\s*(?:(?:(?:per|\/|a)\s*month)|(?:p|\/)m)\s*(?:after|from\s*(?:month|day)\s*\d+)/i.test(node.innerText)) {
                        // Example: "$10.99/month after"
                        //          "11 GBP a month from month 4"
                        return true;
                    }
                    if (/(?:(?:€|EUR|GBP|£|\$|USD|₹|INR)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|EUR|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?|₹|INR))\s*(?:after\s*(?:the)?\s*\d+(?:th|nd|rd|th)?\s*(?:months?|days?)|from\s*(?:month|day)\s*\d+)/i.test(node.innerText)) {
                        // Example: "$10.99 after 12 months"
                        //          "11 GBP from month 4"
                        return true;
                    }
                    // Add similar modifications to the other regular expressions as needed.
                    // ...
        
                    // Return `false` if no regular expression matches.
                    return false;
                },
                function (node, nodeOld) {
                    if (/\d+(?:,\d{2})?\s*(?:Euro|€|₹|INR)\s*(?:(?:pro|im|\/)\s*Monat)?\s*(?:ab\s*(?:dem)?\s*\d+\.\s*Monat|nach\s*\d+\s*(?:Monaten|Tagen)|nach\s*(?:einem|1)\s*Monat)/i.test(node.innerText)) {
                        // Example: "10,99 Euro pro Monat ab dem 12. Monat"
                        //          "11€ nach 30 Tagen"
                        return true;
                    }
                    // Add similar modifications to the other regular expressions as needed.
                    // ...
        
                    // Return `false` if no regular expression matches.
                    return false;
                }
            ],
            infoUrl: brw.i18n.getMessage("patternForcedContinuity_infoUrl"),
            info: brw.i18n.getMessage("patternForcedContinuity_info"),
            languages: [
                "en",
                "de"
            ]
        }        
    ]
}

/**
 * Checks if the `patternConfig` is valid.
 * @returns {boolean} `true` if the `patternConfig` is valid, `false` otherwise.
 */
function validatePatternConfig() {
    // Create an array with the names of the configured patterns.
    let names = patternConfig.patterns.map(p => p.name);
    // Check if there are duplicate names.
    if ((new Set(names)).size !== names.length) {
        // If there are duplicate names, the configuration is invalid.
        return false;
    }
    // Check every single configured pattern for validity.
    for (let pattern of patternConfig.patterns) {
        // Ensure that the name is a non-empty string.
        if (!pattern.name || typeof pattern.name !== "string") {
            return false;
        }
        // Ensure that the class name is a non-empty string.
        if (!pattern.className || typeof pattern.className !== "string") {
            return false;
        }
        // Ensure that the detection functions are a non-empty array.
        if (!Array.isArray(pattern.detectionFunctions) || pattern.detectionFunctions.length <= 0) {
            return false;
        }
        // Check every single configured detection function for validity.
        for (let detectionFunc of pattern.detectionFunctions) {
            // Ensure that the detection function is a function with two arguments.
            if (typeof detectionFunc !== "function" || detectionFunc.length !== 2) {
                return false;
            }
        }
        // Ensure that the info URL is a non-empty string.
        if (!pattern.infoUrl || typeof pattern.infoUrl !== "string") {
            return false;
        }
        // Ensure that the info/explanation is a non-empty string.
        if (!pattern.info || typeof pattern.info !== "string") {
            return false;
        }
        // Ensure that the languages are a non-empty array.
        if (!Array.isArray(pattern.languages) || pattern.languages.length <= 0) {
            return false;
        }
        // Check every single language for being a non-empty string.
        for (let language of pattern.languages) {
            // Ensure that the language is a non-empty string.
            if (!language || typeof language !== "string") {
                return false;
            }
        }
    }
    // If all checks have been passed successfully, the configuration is valid and `true` is returned.
    return true;
}

/**
 * @type {boolean} `true` if the `patternConfig` is valid, `false` otherwise.
 */
export const patternConfigIsValid = validatePatternConfig();

/**
 * Prefix for all CSS classes that are added to elements on websites by the extension.
 * @constant
 */
export const extensionClassPrefix = "__ph__";

/**
 * The class that is added to elements detected as patterns.
 * Elements with this class get a black border from the CSS styles.
 * @constant
 */
export const patternDetectedClassName = extensionClassPrefix + "pattern-detected";

/**
 * A class for the elements created as shadows for pattern elements
 * for displaying individual elements using the popup.
 */
export const currentPatternClassName = extensionClassPrefix + "current-pattern";

/**
 * A list of HTML tags that should be ignored during pattern detection.
 * The elements with these tags are removed from the DOM copy.
 */
export const tagBlacklist = ["script", "style", "noscript", "audio", "video"];