class ImgurClientManager {
  constructor(clientIds) {
    this.clientIds = clientIds;
    this.usage = Array(clientIds.length).fill(0);
    this.limit = 50;
    this.resetInterval = 60 * 60 * 1000; // 1 hour
    setInterval(this.resetUsage.bind(this), this.resetInterval);
  }

  resetUsage() {
    this.usage = Array(this.clientIds.length).fill(0);
  }

  getClientId() {
    const availableIndex = this.usage.findIndex((count) => count < this.limit);
    if (availableIndex === -1) {
      throw new Error('All Client IDs have reached their limit');
    }
    this.usage[availableIndex]++;
    return this.clientIds[availableIndex];
  }
}

const clientIds = [
  '84dcc42c77c13ae',
  'd261a235ffb7b42',
  'fa14afe3ec50515',
  '91df45c419e88f1',
  'b0f2a6ca11cf97a',
  'f4e5fe134e2bf61',
  'b8a3ed9c0564af6',
  '66bc0b4e9afbeec',
  '51bac40ffdc021d',
  'aba6d61049df704',

  'afe7cd663114833',
  'c96595b05a8989e',
  'dbed62f246420c6',
  '52786f950a44082',
  '7f6a7a3b9d355b7',
  '561157ee542d9f5',
  '73431a4b7bb5ed0',
  '8a5943196650146',
];

const imgurClientManager = new ImgurClientManager(clientIds);

export default imgurClientManager;
