import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';

const callId = envNum(process.env.TEST_CALL_ID);
const dealId = envNum(process.env.TEST_DEAL_ID);

const findCall = async () => {
  const calls = await gc.getDealCalls(dealId);

  return calls.data.find((call) => call.id === callId);
};

describe('call', () => {
  it.skipIf(Number.isNaN(callId))('addCallComment', async () => {
    // В «Описании» переносом работает любой из \n, \r, \r\n
    await expectResultTrue(
      gc.addCallComment({ callId, text: 'Тестовый комментарий\nВторая строка комментария' }),
    );
  });

  it.skipIf(Number.isNaN(callId))('addCallTranscription', async () => {
    await expectResultTrue(
      gc.addCallTranscription({ callId, text: 'Тестовая транскрибация звонка' }),
    );
  });

  it.skipIf(Number.isNaN(callId) || Number.isNaN(dealId))(
    'addCallTranscription — HTML-разметка',
    async () => {
      // Абзацы идут тегами (<p>текст</p>, <br>, <br />), \n в интерфейсе схлопывается в пробел
      const text = [
        '— Здравствуйте! Вам удобно сейчас говорить?',
        '— Да, слушаю вас',
        '— Подскажите, вы оставляли заявку на курс по вёрстке?',
        '— Оставлял, но хотел уточнить сроки доступа',
        '— Доступ бессрочный, материалы остаются после окончания потока',
      ]
        .map((line) => `<p>${line}</p>`)
        .join('');

      await expectResultTrue(gc.addCallTranscription({ callId, text }));

      const call = await findCall();

      expect(call?.comment).toBe(text);
    },
  );

  it.skipIf(Number.isNaN(callId) || Number.isNaN(dealId))(
    'addCallTranscription — длинный текст',
    async () => {
      // 30 реплик ≈ 2300 символов — вдвое с лишним ниже предела поля
      const text = Array.from(
        { length: 30 },
        (_, index) =>
          `<p>— Реплика ${index + 1}: клиент уточняет условия оплаты и сроки доступа к курсу</p>`,
      ).join('');

      await expectResultTrue(gc.addCallTranscription({ callId, text }));

      const call = await findCall();

      expect(call?.comment).toHaveLength(text.length);
      expect(call?.comment).toBe(text);
    },
  );
});
