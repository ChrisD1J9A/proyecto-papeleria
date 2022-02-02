import { PipeTransform, Pipe } from "@angular/core";

@Pipe({name: 'removerAcentos'})
export class RemoverAcentosPipe implements PipeTransform {

    transform(value: string) {
        return value != null ? value.replace(/Á/g,'A')
                    .replace(/É/g,'E')
                    .replace(/Í/g,'I')
                    .replace(/Ó/g,'O')
                    .replace(/Ú/g,'U') : null;
    }
}
