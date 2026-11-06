
export default {
  test: {
    // Os arquivos de teste compartilham um banco exclusivo; executar sequencialmente.
    fileParallelism: false,
    testTimeout: 15000
  }
};
