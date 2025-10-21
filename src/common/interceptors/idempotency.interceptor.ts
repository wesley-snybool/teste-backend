import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Armazenamento em memória para idempotência (em produção, usar Redis)
const idempotencyStore = new Map<string, any>();

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['idempotency-key'];

    // Apenas para requisições POST
    if (request.method !== 'POST' || !idempotencyKey) {
      return next.handle();
    }

    // Verifica se já existe uma resposta para essa chave
    if (idempotencyStore.has(idempotencyKey)) {
      const cachedResponse = idempotencyStore.get(idempotencyKey);
      return new Observable((observer) => {
        observer.next(cachedResponse);
        observer.complete();
      });
    }

    // Armazena a resposta para futuras requisições
    return next.handle().pipe(
      tap((response) => {
        // Armazena por 24 horas (em produção, usar TTL no Redis)
        idempotencyStore.set(idempotencyKey, response);
        setTimeout(() => {
          idempotencyStore.delete(idempotencyKey);
        }, 24 * 60 * 60 * 1000);
      }),
    );
  }
}

