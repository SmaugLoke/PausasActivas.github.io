const twilio = require('twilio');

const accountSid = 'AC7b4ce01a9dcde8f2e13734d9ce634439';
const authToken = '8c8b507783ad40bff42a4a11ca552d25';
const client = new twilio(accountSid, authToken);

const numerosDestinatarios = ['+573195888509', '+573106487576', '+573138967392'];

function enviarRecordatorio() {
  numerosDestinatarios.forEach(numero => {
    client.messages.create({
      body: 'Recuerda realizar tu pausa activa. Aquí está el link: [URL]',
      from: '+12564482896',  // El número de Twilio
      to: numero
    })
    .then((message) => console.log(`SMS enviado a ${numero}: ${message.sid}`))
    .catch((error) => console.error(`Error al enviar el SMS a ${numero}: ${error.message}`));
  });
}

enviarRecordatorio();
