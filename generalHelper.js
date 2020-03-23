export class GeneralHelper {
    constructor() {
    }

    flattenKeysAndValuesInOrder(dict) {
        let keysAndValues = [];
        const keys = Object.keys(dict);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = dict[key];
            keysAndValues.push(key);
            keysAndValues.push(value);
        }
        return keysAndValues;
    }

    rawJsonToPrettyJson(rawJsonString) {
        rawJsonString = rawJsonString.trim();
        if (isEmptyString(rawJsonString)) {
            return JSON.stringify({});
        }
        const json = JSON.parse(rawJsonString);
        const pretyJsonString = JSON.stringify(json, undefined, 4);
        return pretyJsonString;
    }
};