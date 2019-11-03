export class DataStore {
    static getValue(key){ return JSON.parse(localStorage.getItem(key)); }

    static setValue(key, value){ localStorage.setItem(key,  JSON.stringify(value) ); }
}