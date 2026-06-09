// import { Injectable, inject } from '@angular/core';
// import { Platform } from '@ionic/angular/standalone';
// import { LocalNotifications } from '@capacitor/local-notifications';

// @Injectable({ providedIn: 'root' })
// export class NotificationService {
//   private platform = inject(Platform);
//   private readonly INVENTARIO_ID = 1000;

//   // ==========================================
//   // NOTIFICAÇÕES: COLA (25 e 29 DIAS)
//   // ==========================================
//   async agendarNotificacoesCola(dataAberturaIso: string) {
//     if (!this.platform.is('capacitor')) return;

//     // Limpa alarmes antigos da cola para não duplicar se a utilizadora alterar a data manualmente
//     await LocalNotifications.cancel({ notifications: [{ id: this.INVENTARIO_ID + 1 }, { id: this.INVENTARIO_ID + 2 }] });

//     const dataAbertura = new Date(dataAberturaIso);

//     // Alerta de 25 dias (Aviso) -> Toca às 09:00 da manhã
//     const dataAviso = new Date(dataAbertura);
//     dataAviso.setDate(dataAviso.getDate() + 25);
//     dataAviso.setHours(9, 0, 0, 0); 

//     // Alerta de 29 dias (Crítico) -> Toca às 09:00 da manhã do dia anterior ao vencimento
//     const dataCritico = new Date(dataAbertura);
//     dataCritico.setDate(dataCritico.getDate() + 29);
//     dataCritico.setHours(9, 0, 0, 0); 

//     const notificacoes = [];
//     const agora = new Date().getTime();

//     if (dataAviso.getTime() > agora) {
//       notificacoes.push({
//         title: '⚠️ Atenção à sua Cola!',
//         body: 'A sua cola principal atingiu 25 dias de uso. Prepare-se para a trocar em breve.',
//         id: this.INVENTARIO_ID + 1,
//         schedule: { at: dataAviso }
//       });
//     }

//     if (dataCritico.getTime() > agora) {
//       notificacoes.push({
//         title: '🚨 Troca de Cola Urgente amanhã!',
//         body: 'A sua cola atinge 30 dias amanhã! Troque-a para garantir a retenção perfeita.',
//         id: this.INVENTARIO_ID + 2,
//         schedule: { at: dataCritico }
//       });
//     }

//     if (notificacoes.length > 0) {
//       await LocalNotifications.schedule({ notifications: notificacoes });
//     }
//   }

//   // ==========================================
//   // NOTIFICAÇÕES: AGENDA (3H e 1H ANTES)
//   // ==========================================
//   async agendarNotificacaoAgenda(agendamentoId: string, data: string, horario: string, clienteNome: string) {
//      if (!this.platform.is('capacitor')) return;

//      const numericId = this.gerarIdNumerico(agendamentoId);
     
//      // Cancela alertas antigos deste mesmo atendimento (útil se for uma "Edição" de horário)
//      await LocalNotifications.cancel({ notifications: [{ id: numericId + 1 }, { id: numericId + 2 }] });

//      // Monta a data exata do atendimento a partir das strings do Firebase
//      const [ano, mes, dia] = data.split('-').map(Number);
//      const [hora, minuto] = horario.split(':').map(Number);
//      const dataAtendimento = new Date(ano, mes - 1, dia, hora, minuto, 0);

//      const tresHorasAntes = new Date(dataAtendimento.getTime() - (3 * 60 * 60 * 1000));
//      const umaHoraAntes = new Date(dataAtendimento.getTime() - (1 * 60 * 60 * 1000));

//      const notificacoes = [];
//      const agora = new Date().getTime();

//      if (tresHorasAntes.getTime() > agora) {
//        notificacoes.push({
//          title: '📅 Próximo Atendimento',
//          body: `Faltam 3 horas para o seu atendimento com ${clienteNome}.`,
//          id: numericId + 1,
//          schedule: { at: tresHorasAntes }
//        });
//      }

//      if (umaHoraAntes.getTime() > agora) {
//        notificacoes.push({
//          title: '⏰ Atendimento Iminente!',
//          body: `O seu atendimento com ${clienteNome} começa em 1 hora! Prepare-se.`,
//          id: numericId + 2,
//          schedule: { at: umaHoraAntes }
//        });
//      }

//      if (notificacoes.length > 0) {
//        await LocalNotifications.schedule({ notifications: notificacoes });
//      }
//   }

//   async cancelarNotificacaoAgenda(agendamentoId: string) {
//     if (!this.platform.is('capacitor')) return;
//     const numericId = this.gerarIdNumerico(agendamentoId);
//     await LocalNotifications.cancel({ notifications: [{ id: numericId + 1 }, { id: numericId + 2 }] });
//   }

//   // Conversor de ID Firebase (String) para ID Android (Número Int32)
//   private gerarIdNumerico(str: string): number {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = ((hash << 5) - hash) + str.charCodeAt(i);
//       hash = hash & hash;
//     }
//     return Math.abs(hash);
//   }
// }

import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private platform = inject(Platform);
  private readonly INVENTARIO_ID = 1000;

  // ==========================================
  // NOTIFICAÇÕES: COLA (25 e 29 DIAS)
  // ==========================================
  async agendarNotificacoesCola(dataAberturaIso: string) {
    const isNative = this.platform.is('capacitor');

    if (isNative) {
      await LocalNotifications.cancel({ notifications: [{ id: this.INVENTARIO_ID + 1 }, { id: this.INVENTARIO_ID + 2 }] });
    } else {
      console.log('🧹 [DEBUG] Limpando alarmes antigos da cola...');
    }

    const dataAbertura = new Date(dataAberturaIso);

    const dataAviso = new Date(dataAbertura);
    dataAviso.setDate(dataAviso.getDate() + 25);
    dataAviso.setHours(9, 0, 0, 0); 

    const dataCritico = new Date(dataAbertura);
    dataCritico.setDate(dataCritico.getDate() + 29);
    dataCritico.setHours(9, 0, 0, 0); 

    const notificacoes = [];
    const agora = new Date().getTime();

    if (dataAviso.getTime() > agora) {
      notificacoes.push({
        title: '⚠️ Atenção à sua Cola!',
        body: 'A sua cola principal atingiu 25 dias de uso. Prepare-se para a trocar em breve.',
        id: this.INVENTARIO_ID + 1,
        schedule: { at: dataAviso }
      });
    }

    if (dataCritico.getTime() > agora) {
      notificacoes.push({
        title: '🚨 Troca de Cola Urgente amanhã!',
        body: 'A sua cola atinge 30 dias amanhã! Troque-a para garantir a retenção perfeita.',
        id: this.INVENTARIO_ID + 2,
        schedule: { at: dataCritico }
      });
    }

    if (notificacoes.length > 0) {
      if (isNative) {
        await LocalNotifications.schedule({ notifications: notificacoes });
      } else {
        console.log('🔔 [SIMULAÇÃO WEB - COLA] Alarmes Prontos para Disparo:', notificacoes.map(n => ({
          Titulo: n.title,
          Mensagem: n.body,
          VaiTocarEm: n.schedule?.at?.toLocaleString('pt-BR')
        })));
      }
    } else {
      console.log('ℹ️ [SIMULAÇÃO WEB - COLA] Nenhuma notificação agendada (As datas já passaram).');
    }
  }

  // ==========================================
  // NOTIFICAÇÕES: AGENDA (3H e 1H ANTES)
  // ==========================================
  async agendarNotificacaoAgenda(agendamentoId: string, data: string, horario: string, clienteNome: string) {
     const isNative = this.platform.is('capacitor');
     const numericId = this.gerarIdNumerico(agendamentoId);
     
     if (isNative) {
       await LocalNotifications.cancel({ notifications: [{ id: numericId + 1 }, { id: numericId + 2 }] });
     }

     const [ano, mes, dia] = data.split('-').map(Number);
     const [hora, minuto] = horario.split(':').map(Number);
     const dataAtendimento = new Date(ano, mes - 1, dia, hora, minuto, 0);

     const tresHorasAntes = new Date(dataAtendimento.getTime() - (3 * 60 * 60 * 1000));
     const umaHoraAntes = new Date(dataAtendimento.getTime() - (1 * 60 * 60 * 1000));

     const notificacoes = [];
     const agora = new Date().getTime();

     if (tresHorasAntes.getTime() > agora) {
       notificacoes.push({
         title: '📅 Próximo Atendimento',
         body: `Faltam 3 horas para o seu atendimento com ${clienteNome}.`,
         id: numericId + 1,
         schedule: { at: tresHorasAntes }
       });
     }

     if (umaHoraAntes.getTime() > agora) {
       notificacoes.push({
         title: '⏰ Atendimento Iminente!',
         body: `O seu atendimento com ${clienteNome} começa em 1 hora! Prepare-se.`,
         id: numericId + 2,
         schedule: { at: umaHoraAntes }
       });
     }

     if (notificacoes.length > 0) {
       if (isNative) {
         await LocalNotifications.schedule({ notifications: notificacoes });
       } else {
         console.log(`🔔 [SIMULAÇÃO WEB - AGENDA: ${clienteNome}] Alarmes Prontos:`, notificacoes.map(n => ({
           Titulo: n.title,
           VaiTocarEm: n.schedule?.at?.toLocaleString('pt-BR')
         })));
       }
     } else {
        console.log(`ℹ️ [SIMULAÇÃO WEB - AGENDA: ${clienteNome}] Não há alarmes futuros.`);
     }
  }

  async cancelarNotificacaoAgenda(agendamentoId: string) {
    const isNative = this.platform.is('capacitor');
    const numericId = this.gerarIdNumerico(agendamentoId);
    
    if (isNative) {
      await LocalNotifications.cancel({ notifications: [{ id: numericId + 1 }, { id: numericId + 2 }] });
    } else {
      console.log(`🛑 [SIMULAÇÃO WEB - CANCELAMENTO] O alarme do agendamento ${agendamentoId} foi desligado.`);
    }
  }

  private gerarIdNumerico(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}