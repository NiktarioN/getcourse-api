const axios = require('axios');

module.exports = class Getcourse {
  #token;
  #base_url;

  constructor(dev_key, api_key, domain) {
    this.#token = `Bearer ${dev_key}_${api_key}`;
    this.#base_url = `https://${domain}/pl/api/v1/`;
  }

  async #doPost(method, body = {}) {
    try {
      const response = await axios.post(`${this.#base_url}${method}`, body, {
        headers: { Authorization: this.#token, 'Content-Type': 'application/json' },
        timeout: 15000,
      });
      return response.data;
    } catch (e) {
      return this.#handleError(e);
    }
  }

  async #doGet(method, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();

      const response = await axios.get(`${this.#base_url}${method}?${query}`, {
        headers: { Authorization: this.#token },
        timeout: 15000,
      });

      return response.data;
    } catch (e) {
      return this.#handleError(e);
    }
  }

  #handleError(e) {
    if (e.response) {
      return {
        success: false,
        status: e.response.status,
        data: e.response.data,
      };
    }

    return { success: false, message: e.message };
  }

  #pickDefined(obj = {}) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      out[k] = v;
    }
    return out;
  }

  async setUri(body) {
    return await this.#doPost(`set-uri`, body);
  }

  async getAllGroups() {
    return await this.#doGet(`common/get-groups`, {});
  }

  async getAllPersonalManagers() {
    return await this.#doGet(`common/get-personal-managers`, {});
  }

  async getTrainings() {
    return await this.#doGet(`common/get-trainings`, {});
  }

  async getOfferById(offerId) {
    return await this.#doGet(`offer/get-offer-by-id`, { offerId });
  }

  async getOffers() {
    return await this.#doGet(`offer/get-offers`, {});
  }

  async getOffersTags(limit, offset) {
    return await this.#doGet(`offer/get-offers-tags`, this.#pickDefined({ limit, offset }));
  }

  async addDealPositions(body) {
    return await this.#doPost(`deal/add-positions`, body);
  }

  async removeDealPositions(body) {
    return await this.#doPost(`deal/remove-positions`, body);
  }

  async updateDealFields(body) {
    return await this.#doPost(`deal/update-fields`, body);
  }

  async getDealFields(dealId) {
    return await this.#doGet(`deal/get-fields`, { dealId });
  }

  async getDealCustomFields(dealId) {
    return await this.#doGet(`deal/get-custom-fields`, { dealId });
  }

  async getDealComments(dealId) {
    return await this.#doGet(`deal/get-comments`, { dealId });
  }

  async getDealCalls(dealId) {
    return await this.#doGet(`deal/get-calls`, { dealId });
  }

  async getDealCancelReasons() {
    return await this.#doGet(`deal/get-cancel-reasons`, {});
  }

  async getDealsTags(limit, offset) {
    return await this.#doGet(`deal/get-deals-tags`, this.#pickDefined({ limit, offset }));
  }

  async addCommentToLessonAnswer(body) {
    return await this.#doPost(`lesson/add-comment-to-lesson-answer`, body);
  }

  async changeStatusAnswers(body) {
    return await this.#doPost(`lesson/change-status-answers`, body);
  }

  async getLessonAnswers(lessonId) {
    return await this.#doGet(`lesson/get-lesson-answers`, { lessonId });
  }

  async addNote(body) {
    return await this.#doPost(`note/add`, body);
  }

  async addBalance(body) {
    return await this.#doPost(`user/add-balance`, body);
  }

  async addGroups(body) {
    return await this.#doPost(`user/add-groups`, body);
  }

  async removeGroups(body) {
    return await this.#doPost(`user/remove-groups`, body);
  }

  async setGroups(body) {
    return await this.#doPost(`user/set-groups`, body);
  }

  async setPersonalManager(body) {
    return await this.#doPost(`user/set-personal-manager`, body);
  }

  async updateUserCustomFields(body) {
    return await this.#doPost(`user/update-custom-fields`, body);
  }

  async updateUserFields(body) {
    return await this.#doPost(`user/update-fields`, body);
  }

  async createDiploma(body) {
    return await this.#doPost(`user/create-diploma`, body);
  }

  async getUserBalance({ userId, email, type } = {}) {
    return await this.#doGet(`user/get-balance`, this.#pickDefined({ userId, email, type }));
  }

  async getUserLessonAnswers({ userId, email } = {}) {
    return await this.#doGet(`user/get-lesson-answers`, this.#pickDefined({ userId, email }));
  }

  async getUserAnswers({ userId, email } = {}) {
    return await this.#doGet(`user/get-answers`, this.#pickDefined({ userId, email }));
  }

  async getUserByTelegramChatId(chatId) {
    return await this.#doGet(`user/get-user-by-telegram-chat-id`, { chatId });
  }

  async getUserCustomFields({ userId, email } = {}) {
    return await this.#doGet(`user/get-custom-fields`, this.#pickDefined({ userId, email }));
  }

  async getUserDeals({ userId, email } = {}) {
    return await this.#doGet(`user/get-deals`, this.#pickDefined({ userId, email }));
  }

  async getUserDiplomas({ userId, email } = {}) {
    return await this.#doGet(`user/get-diplomas`, this.#pickDefined({ userId, email }));
  }

  async getUserFields({ userId, email } = {}) {
    return await this.#doGet(`user/get-fields`, this.#pickDefined({ userId, email }));
  }

  async getUserGoalRecords({ userId, email } = {}) {
    return await this.#doGet(`user/get-goal-records`, this.#pickDefined({ userId, email }));
  }

  async getUserGroups({ userId, email } = {}) {
    return await this.#doGet(`user/get-groups`, this.#pickDefined({ userId, email }));
  }

  async getUserPurchases({ userId, email } = {}) {
    return await this.#doGet(`user/get-purchases`, this.#pickDefined({ userId, email }));
  }

  async getUserSchedule({ userId, email } = {}) {
    return await this.#doGet(`user/get-schedule`, this.#pickDefined({ userId, email }));
  }

  async getUserTrainings({ userId, email } = {}) {
    return await this.#doGet(`user/get-trainings`, this.#pickDefined({ userId, email }));
  }

  async getAllWebinars() {
    return await this.#doGet(`webinar/get-all-webinars`, {});
  }

  async getWebinarsByIds(ids = []) {
    return await this.#doPost(`webinar/get-webinars-by-ids`, { ids });
  }
};
