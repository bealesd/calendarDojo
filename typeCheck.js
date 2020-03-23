export class TypeCheck {
    constructor() {
        this.stringCheck();
        this.objectCheck();
        this.arrayCheck();

        this._toString = Object.prototype.toString
    }

    isPrimitive(value) {
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'symbol' ||
            typeof value === 'boolean'
        )
    }

    toRawType(value) {
        return this._toString.call(value).slice(8, -1)
    }

    isString(value) {
        return typeof value === 'string';
    }

    stringCheck() {
        Object.prototype.isEmptyString = (value) => {
            if (this.isString(value) == false)
                return true;
            else if (value.trim() === "")
                return true;
            else
                return false;
        };
    }

    objectCheck() {
        Object.prototype.isObject = (value) => {
            return this.toRawType(value) === 'Object';
        }
    }

    arrayCheck() {
        Object.prototype.isArray = (value) => {
            return this.toRawType(value) === 'Array';
        }
    }

    isPromise(val) {
        return (
            isDef(val) &&
            typeof val.then === 'function' &&
            typeof val.catch === 'function'
        )
    }
};