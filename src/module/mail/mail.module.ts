import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Global, Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { join } from 'path'
import { TicketModule } from '../ticket/ticket.module'
import { FlightModule } from '../flight/flight.module'

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.sendgrid.net',
        secure: false,
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
      defaults: {
        from: '"AirVenture" <huynhhuy.forwork@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    TicketModule,
    FlightModule,
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
