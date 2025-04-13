import ims from 'ims-lti';
import bodyParser from 'body-parser'; // Импорт body-parser
const { Provider } = ims;

const consumerKey = 'consumer';
const consumerSecret = 'secret';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;

  appendCorsHeaders(event, {
    origin: '*',
    methods: ['GET', 'POST']
  })

  // Добавление middleware для обработки URL-кодированных данных
  await new Promise((resolve, reject) => {
    bodyParser.urlencoded({ extended: true })(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const provider = new Provider(consumerKey, consumerSecret);

  try {
    const isValid = await new Promise((resolve, reject) => {
      provider.valid_request(req, (err, isValid) => {
        if (err) return reject(err);
        resolve(isValid);
      });
    });

    if (!isValid) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    // Проверка обязательных параметров
    const { user_id, roles, lis_result_sourcedid, lis_outcome_service_url, launch_presentation_return_url, lis_person_name_full, custom_learn } = provider.body;

    // Установка данных сессии
    await setUserSession(event, {
      userId: user_id,
      roles,
      sourcedId: lis_result_sourcedid,
      outcomeServiceUrl: lis_outcome_service_url,
      returnUrl: launch_presentation_return_url,
      userFullName: lis_person_name_full
    }, { cookie: { sameSite: 'lax', secure: false } });

    const session = await getUserSession(event);

    // Редирект на главную страницу приложения
    if (custom_learn) {
      return await sendRedirect(event, '/')
    }
    await sendRedirect(event, '/test');
  } catch (error) {
    console.error('Ошибка обработки LTI-запроса:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});
