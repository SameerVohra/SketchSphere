class GenerateKey {
  static genKey() {
    const str: string =
      "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*:;";
    let keyLen: number = 6;
    let key: string = "";
    for (let i: number = 0; i < keyLen; i++) {
      let ind: number = Math.floor(Math.random() * str.length);
      key += str[ind];
    }
    return key;
  }
  static genProjId() {
    const str: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const len: number = 6;
    let key: string = "";

    for (let i: number = 0; i < len; i++) {
      let ind: number = Math.floor(Math.random() * str.length);
      key += str[ind];
    }
    return key;
  }
}

export default GenerateKey;
