export class DeepSeekServices {
    private inputText: string

    constructor(inputText: string) {
        this.inputText = inputText
    }

    async processText(url: string) {
        try {
            return await $fetch<string>(url, {
              method: 'POST',
              body: {
                text: this.inputText,
              },
            });
          } catch (error) {
            console.error('Error generating summary:', error);
            throw error;
          }
    }
}