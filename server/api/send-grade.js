import ims from 'ims-lti';
const { OutcomeService } = ims;

const consumerKey = 'consumer';
const consumerSecret = 'secret';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await getUserSession(event);

  if (!session || !session.sourcedId || !session.outcomeServiceUrl) {
    throw createError({ statusCode: 400, message: 'Session data missing' });
  }

  const outcomeService = new OutcomeService({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    service_url: session.outcomeServiceUrl,
    source_did: session.sourcedId,
  });

  return new Promise((resolve, reject) => {
    outcomeService.send_replace_result(body.grade, (err, success) => {
      if (err) {
        console.error('Ошибка при отправке оценки:', err);
        reject(createError({ statusCode: 500, message: 'Ошибка при отправке оценки' }));
      } else if (success) {
        console.log('Оценка успешно отправлена!');
        resolve({ message: 'Оценка успешно отправлена!' });
      } else {
        console.log('Не удалось отправить оценку.');
        reject(createError({ statusCode: 500, message: 'Не удалось отправить оценку' }));
      }
    });
  });
});
