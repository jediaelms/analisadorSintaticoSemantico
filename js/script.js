var contErroLexico = 0;
let palavras_reservadas = [["<=", "MENOR_IGUAL"], [">=", "MAIOR_IGUAL"], ["<>", "DIFERENTE"], [":=", "ATRIBUICAO"], ["<", "MENOR"], [">", "MAIOR"], ["(", "ABRE_PARENTESES"], ["*", "OP_MULT"], ["+", "OP_ADICAO"], ["=", "OP_IGUAL"], ["-", "OP_SUBT"], [",", "VIRGULA"], [":", "DOIS_PONTOS"], ["div", "OP_DIV"], ["int", "TIPO_INTEIRO"], ["real", "TIPO_REAL"], ["boolean", "TIPO_BOOLEAN"], ["true", "BOOLEAN_TRUE"], ["false", "BOOLEAN_FALSE"], ["begin", "DELIM_BEGIN"], ["end", "DELIM_END"], [")", "FECHA_PARENTESES"], ["if", "CONDICIONAL"], [";", "PONTO_E_VIRGULA"], ["program", "PROGRAM"], ["procedure", "PROCEDURE"], ["var", "VAR"], ["read", "READ"], ["write", "WRITE"], ["then", "THEN"], ["do", "DO"], ["while", "ENQUANTO"], ["then", "THEN"], ["else", "SENAO"], ["and", "E"], ["not", "NOT"], ["or", "OU"]];
let lexica = []; // Variável que armazena a análise léxica
let contLex = 0;
var lines;
//linha[posAtual+1] == "<" || linha[posAtual+1] == ">" || linha[posAtual+1] == "<=" || linha[posAtual+1] == ">=" || linha[posAtual+1] == "<>" || linha[posAtual+1] == "(" || linha[posAtual+1] == ":=" || linha[posAtual+1] == "*" || linha[posAtual+1] == "+" || linha[posAtual+1] == "=" || linha[posAtual+1] == "-" || linha[posAtual+1] == ")" || linha[posAtual+1] == ";" || 

let it_linha = 0
let it_coluna = 0


//--------------------------------- VARIÁVEIS SEMANTICAS ----------------------------------------

let tabs_sem = []

let tab_conts = []
 
let escopo_atual = 0


//--------------------------------- VARIÁVEIS SEMANTICAS ----------------------------------------

function abrirArquivo(e) {
	// Abre arquivo
	var file = e.target.files[0];
	if (!file) { return; }

	var reader = new FileReader();
	reader.onload = function (e) {
		// Lê o conteúdo do arquivo
		var conteudo = e.target.result;
		$("#text-area-1").val(conteudo);
		//console.log(conteudo)
	};
	reader.readAsText(file);

	//console.log(conteudo);
}

//-------------------------------------------------- ANÁLISE LÉXICA -----------------------------------------------

function getColuna(vetor, indice) {
	var cont = 0;
	for (i = 0; i < indice; i++) {
		cont += (vetor[i].length + 1);
	}
	return cont;
}

function getIndice(matriz, palavra) {
	for (i = 0; i < matriz.length; i++) {
		if (matriz[i][0] == palavra) {
			return i;
		}
	}
	return -1;
}

function ehIdentificador(string, linha) {
	aux = true;
	if (string[0].match("[A-Z]|_|[a-z]")) {
		for (k = 1; k < string.length; k++) {
			if (!string[k].match("[A-Z]|_|[a-z]|[0-9]")) {
				aux = false;
			}
		}
		if (aux) {
			lexica.push(["IDENTIFICADOR", string, (it_linha + 1).toString(), (it_coluna + 1).toString(), (it_coluna + string.length).toString()]);
			return "IDENTIFICADOR";
		} else {
			lexica.push(["TOKEN_INVALIDO", string, (it_linha + 1).toString(), (it_coluna + 1).toString(), (it_coluna + string.length).toString()]);
			contErroLexico++;
			return "TOKEN_INVALIDO";
		}
	}
	else {
		if (!isNaN(string[0])) {
			j = 1;
			auxDec = 0;
			while ((!isNaN(string[j]) && j < string.length) || (string[j] == "." && j < string.length)) {
				if (string[j] == ".") {
					auxDec++;
				}
				j++; //CORRECTION
			}

			j--;

			if (auxDec == 1) { //Tem o ponto, então é decimal
				//console.log("FLAG")
				lexica.push(["NUM_DEC", string, (i + 1).toString(), (j).toString()]);
				return "NUM_DEC";
			}
			else if (auxDec > 1) {
				lexica.push(["TOKEN_INVALIDO", string, (i + 1).toString(), (j).toString()]);
				contErroLexico++;
				return "TOKEN_INVALIDO";
			}
			else {
				lexica.push(['NUM_NAT', string, (i + 1).toString(), (j).toString()]);
				return "NUM_NAT";
			}
		}
		else {
			lexica.push(["TOKEN_INVALIDO", string, (it_linha).toString(), (getColuna(linha, it_coluna) + 1).toString(), (getColuna(linha, it_coluna) + string.length).toString()]);
			contErroLexico++;
			return "TOKEN_INVALIDO";
		}

	}
}

function verificaPalavra(linha, aux) {
	indice = getIndice(palavras_reservadas, aux);
	if (indice != -1) {
		if (aux[0] == "<" || aux[0] == ">" || aux[0] == ":") {
			if (linha[it_coluna + 1] != undefined) {
				if (linha[it_coluna + 1] == "=" || linha[it_coluna + 1] == ">") {
					return "";
				}
			}
		}
		if (indice >= 0 && indice <= 13) {
			lexica.push([palavras_reservadas[indice][1], palavras_reservadas[indice][0], it_linha + 1, (getColuna(linha, it_coluna) + 1).toString(), (getColuna(linha, it_coluna) + aux.length).toString()]);
			return palavras_reservadas[indice][1];
		}
		else {
			if (linha[it_coluna + 1] == undefined) {
				lexica.push([palavras_reservadas[indice][1], palavras_reservadas[indice][0], it_linha + 1, (getColuna(linha, it_coluna) + 1).toString(), (getColuna(linha, it_coluna) + aux.length).toString()]);
				return palavras_reservadas[indice][1];
			}
			else {//Verificar o próximo caractere (se não é letra ou número)
				if (linha[it_coluna + 1] == "<" || linha[it_coluna + 1] == ">" || linha[it_coluna + 1] == "(" || linha[it_coluna + 1] == ":=" || linha[it_coluna + 1] == "*" || linha[it_coluna + 1] == "+" || linha[it_coluna + 1] == "=" || linha[it_coluna + 1] == "-" || linha[it_coluna + 1] == ")" || linha[it_coluna + 1] == ";" || linha[it_coluna + 1] == "," || linha[it_coluna + 1] == "." || linha[it_coluna + 1] == " ") {
					lexica.push([palavras_reservadas[indice][1], palavras_reservadas[indice][0], it_linha + 1, (getColuna(linha, it_coluna) + 1).toString(), (getColuna(linha, it_coluna) + aux.length).toString()]);
					return palavras_reservadas[indice][1];
				}
			}
		}

	}
	else {
		if (linha[it_coluna + 1] == undefined) {
			//Tratamento especial caso seja o ponto final (último caractere do programa)
			if (linha[it_coluna] == "." && it_linha == (lines.length - 1)) {
				lexica.push(["PONTO_FINAL", ".", it_linha + 1, (getColuna(linha, it_coluna) + 1).toString(), (getColuna(linha, it_coluna) + aux.length).toString()]);
				return ".";
			}
			return ehIdentificador(aux, linha);
		}
		//else if (linha[it_coluna + 1] == "." || linha[it_coluna + 1] == "<" || linha[it_coluna + 1] == ">" || linha[it_coluna + 1] == "<=" || linha[it_coluna + 1] == ">=" || linha[it_coluna + 1] == "<>" || linha[it_coluna + 1] == "(" || linha[it_coluna + 1] == ":=" || linha[it_coluna + 1] == ":" || linha[it_coluna + 1] == "*" || linha[it_coluna + 1] == "+" || linha[it_coluna + 1] == "=" || linha[it_coluna + 1] == "-" || linha[it_coluna + 1] == ")" || linha[it_coluna + 1] == ";" || linha[it_coluna + 1] == "," || linha[it_coluna + 1] == " ") {
		else if (linha[it_coluna + 1] == "." || linha[it_coluna + 1] == "<" || linha[it_coluna + 1] == ">" || linha[it_coluna + 1] == "(" || linha[it_coluna + 1] == ":" || linha[it_coluna + 1] == "*" || linha[it_coluna + 1] == "+" || linha[it_coluna + 1] == "=" || linha[it_coluna + 1] == "-" || linha[it_coluna + 1] == ")" || linha[it_coluna + 1] == ";" || linha[it_coluna + 1] == "," || linha[it_coluna + 1] == " ") {
			if((linha[it_coluna + 1] == ".") && (!isNaN(linha[it_coluna + 2])) && (!isNaN(linha[it_coluna]))){ //CORRECTION >
				return "";
			} //CORRECTION <
			return ehIdentificador(aux, linha);
		}
	}
	return "";
}



function analiseLexica(lines) {


	//Pega os dados da área de texto e separa em linhas e então em tokens (que são separados por espaços)
	/*var text = document.getElementById("text-area-1");
	text = text.value;
	lines = text.split("\n");
	console.log(lines);*/
	//lexica = [lines.length];

	let auxDec = 0;
	let auxStr = "";
	let aux = "";
	let contComent = 0;
	let lexema = "";

	if (it_coluna + 1 > lines[it_linha].length) {
		it_linha++;
		if (it_linha >= lines.length) {
			return "";
		}
		it_coluna = 0;
	}

	for (; it_coluna < lines[it_linha].length; it_coluna++) {
		if (lines[it_linha].charAt(it_coluna) == "/" && lines[it_linha].charAt(it_coluna + 1) == "/") {
			it_linha++;
			it_coluna = 0;
		}
		else if (lines[it_linha].charAt(it_coluna) == "{") {
			contComent = 1;
		}
		else if (lines[it_linha].charAt(it_coluna) == "}") {
			contComent = 0;
		}
		else if (lines[it_linha].charAt(it_coluna) != " " && lines[it_linha].charAt(it_coluna) != "	" && contComent == 0) {

			aux += lines[it_linha].charAt(it_coluna);
			lexema = verificaPalavra(lines[it_linha], aux);

			if (lexema != "") {
				aux = "";
				if (it_coluna + 1 > lines[it_linha].length) {
					//console.log("flag");
					it_linha++;
					it_coluna = 0;
				}
				else {
					it_coluna++
				}
				return lexema;
			}

		}
		if (it_coluna + 1 > lines[it_linha].length) {
			it_linha++;
			it_coluna = 0;
		}
		//console.log(lexica);
	}


	//console.log(lexica);

	/*let table = document.querySelector('table');
	let li = null;
	tr = document.createElement('tr');
	tr.innerHTML = "<th>Token</th> <th>Lexema</th> <th>Linha</th> <th>Coluna Inicial</th> <th>Coluna Final</th>";
	table.appendChild(tr);
	for (let i = 0; i < lexica.length; i++) {
		tr = document.createElement('tr');
		tr.innerHTML = "<td>" + lexica[i][0] + "</td> <td>" + lexica[i][1] + "</td> <td>" + lexica[i][2] + "</td> <td>" + lexica[i][3] + "</td> <td>" + lexica[i][4] + "</td>";
		table.appendChild(tr);
	}*/


	//console.log("Sucesso");


}


//-------------------------------------------------- ANÁLISE SINTÁTICA -----------------------------------------------



function analiseProgram(pos) {

	tabs_sem[escopo_atual] = [] //SEMANTIC
	tab_conts[escopo_atual] = 0 //SEMANTIC

	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return false;
	}
	if (token == "PROGRAM") {
		try {
			token = lexica[pos + 1][0];
		} catch (error) {
			return false;
		}
		if (token == "IDENTIFICADOR") {
			try {
				token = lexica[pos + 2][0];
			} catch (error) {
				return false;
			}
			if (token == "PONTO_E_VIRGULA") {
				let pos1 = analiseBloco(pos + 3);
				if (pos1 != -1) {
					try {
						token = lexica[pos1][0];
					} catch (error) {
						return false;
					}
					if (token == "PONTO_FINAL") {
						return true;
					}
					else return false;
				}
				else return false;
			}
			else return false;
		}
		else return false;
	}
	else return false;
}

function analiseBloco(pos) {
	let pos1 = analiseParteDecVar(pos);
	if (pos1 != -1) {
		pos = pos1;
	}

	pos1 = analiseParteDecSubRot(pos);
	if (pos1 != -1) {
		pos = pos1;
	}

	pos1 = analiseComandoComp(pos);
	return pos1;
}


function analiseParteDecVar(pos) {
	let pos1 = analiseDecVar(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}

		if (token == "PONTO_E_VIRGULA") {
			pos1++;
		}
		else return -1;

		let pos2 = analiseDecVar(pos1);
		if (pos2 == -2) {
			return pos1;
		}
		else if (pos2 == -1) {
			return pos2;
		}
		//pos1 = pos2;
		while (pos2 > -1) {
			try {
				token = lexica[pos2][0];
			} catch (error) {
				return -1;
			}
			if (token == "PONTO_E_VIRGULA") {
				pos1 = pos2 + 1;
			}
			else return -1;
			pos2 = analiseDecVar(pos1)
		}
		return pos1;
	}
	else return -1;
}

function analiseDecVar(pos) {
	let pos1 = analiseTipoSimples(pos);
	if (pos1 != -1) {
		pos1 = analiseListaIdent(pos1);
		if(pos1 > 0){ //SEMANTIC >
			for(let cont1 = pos1 - 1 ; cont1 > pos ; cont1 --){ 
				if(buscaTabSem(lexica[cont1][1], 1) == -1){
					tabs_sem[escopo_atual][tab_conts[escopo_atual]] = [lexica[cont1][1], lexica[cont1][0], escopo_atual, 1, 0, lexica[pos][0], '' , ''];
					tab_conts[escopo_atual] ++;
				}
				else{
					console.log("ERRO SEMANTICO! --> Variável '" + lexica[cont1][1] + "' já declarada!");
				}
				cont1--; 
			} 
		} //SEMANTIC <
		return pos1;
	}
	else return -2;
}

function analiseTipoSimples(pos) {
	let token;
	try {
		token = lexica[pos][0];
	}
	catch (error) {
		return -1;
	}

	if (token == "TIPO_INTEIRO" || token == "TIPO_REAL" || token == "TIPO_BOOLEAN") {
		return pos + 1;
	}
	else return -1;
}

function analiseListaIdent(pos) {
	let pos1 = analiseIdentificador(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return pos1;
		}

		let pos2 = 0;
		while (token == "VIRGULA") {
			pos2 = analiseIdentificador(pos1 + 1);
			if (pos2 != -1) {
				pos1 = pos2;
			}
			else return -1;
			try {
				token = lexica[pos2][0];
			} catch (error) {
				return -1;
			}
		}
		return pos1;
	}
	else return -1;
}

function analiseIdentificador(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "IDENTIFICADOR" || token == "BOOLEAN_TRUE" || token == "BOOLEAN_FALSE") {
		return pos + 1;
	}
	else return -1;
}


function analiseParteDecSubRot(pos) {
	let pos1 = analiseDecProc(pos);
	if (pos1 > -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}
		if (token == "PONTO_E_VIRGULA") {
			return analiseParteDecSubRot(pos1 + 1);
		}
	}
	else if (pos1 == -2) {
		return pos;
	}
	else if (pos1 == -1) {
		return -1;
	}
}

function analiseDecProc(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}
	if (token == "PROCEDURE") {
		let pos1 = analiseIdentificador(pos + 1);
		if (pos1 != -1) {
			if(buscaTabSem(lexica[pos + 1][1], 2) == -1){ //SEMANTIC >
				tabs_sem[escopo_atual][tab_conts[escopo_atual]] = [lexica[pos + 1][1], lexica[pos + 1][0], escopo_atual, 2, 0, '', '' , []];
				tab_conts[escopo_atual] ++;
			}
			else{
				console.log("ERRO SEMANTICO! --> Procedimento '" + lexica[pos + 1][1] + "' já declarado!");
			} //SEMANTIC <

			let pos2 = analiseParamForm(pos1);
			if (pos2 != -1) {

				atualizaEscopo(1); //SEMANTIC >
				analiseSemParametrosProc("id", pos1, pos2, 1);
				//console.log(tab_conts[escopo_atual],tab_conts[escopo_atual - 1]); //SEMANTIC <

				pos1 = pos2;
			}
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
			if (token == "PONTO_E_VIRGULA") {
				pos1 = analiseBloco(pos1 + 1);
				atualizaEscopo(2); //SEMANTIC >
				//console.log(tabs_sem); //SEMANTIC <
				return pos1;
			}
			else {
				return -1;
			}
		}
		else {
			return -1;
		}
	}
	else {
		return -2;
	}
}

function analiseParamForm(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "ABRE_PARENTESES") {
		let pos1 = analiseSecParamForm(pos + 1);
		if (pos1 != -1) {
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
			while (token == "PONTO_E_VIRGULA") {
				pos1 = analiseSecParamForm(pos1 + 1)
				if (pos1 != -1) {
					try {
						token = lexica[pos1][0];
					} catch (error) {
						return -1;
					}
				}
				else {
					return -1;
				}
			}
			if (token == "FECHA_PARENTESES") {
				return pos1 + 1;
			}
			else {
				return -1;
			}
		}
		else {
			return -1;
		}
	}
}


function analiseSecParamForm(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "VAR") {
		pos = pos + 1;
	}

	let pos1 = analiseListaIdent(pos);
	if (pos1 != -1) {
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}
		if (token == "DOIS_PONTOS") {
			pos1 = analiseTipoSimples(pos1 + 1); //CORRECTION
			return pos1;
		}
		else return -1;
	}
	else return -1;
}


function analiseComandoComp(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "DELIM_BEGIN") {
		/*escopo_atual ++; //SEMANTIC >
		tabs_sem[escopo_atual] = tabs_sem[escopo_atual - 1];
		tab_conts[escopo_atual] = tab_conts[escopo_atual - 1]; //SEMANTIC <*/


		let pos1 = analiseComando(pos + 1);
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}
		while (token == "PONTO_E_VIRGULA") {
			pos1 = analiseComando(pos1 + 1)
			if (pos1 != -1) {
				try {
					token = lexica[pos1][0];
				} catch (error) {
					return -1;
				}
			}
			else {
				return -1;
			}
		}
		if (token == "DELIM_END") {
			/*tabs_sem[escopo_atual] = []; //SEMANTIC >
			tab_conts[escopo_atual] = 0;
			escopo_atual --; //SEMANTIC <*/

			return pos1 + 1;
		}
		else {
			return -1;
		}
	}
	else {
		return -2;
	}
}

function analiseComando(pos) {
	let pos1 = analiseAtribuicao(pos);
	if (pos1 != -1) {

	}
	else {
		pos1 = analiseChamProc(pos);
		if (pos1 != -1) {

		}
		else {
			pos1 = analiseComandoComp(pos);
			if (pos1 > -1) {

			}
			else if (pos1 == -1) {
				return -1;
			}
			else {
				pos1 = analiseComandoCond(pos);
				if (pos1 != -1) {

				}
				else {
					pos1 = analiseComandoRep(pos);
				}
			}
		}
	}
	return pos1;
}


function analiseAtribuicao(pos) {
	let pos1 = analiseVariavel(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}

		if (token == "ATRIBUICAO") {
			pos1 = analiseExpressao(pos1 + 1);
			if (pos1 != -1) {
				analiseSemAtrib(pos, pos1-1); //SEMANTIC
				return pos1;
			}
			else return -1;
		}
		else return -1
	}
	else return pos1;
}

function analiseChamProc(pos) {
	let pos1 = analiseIdentificador(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}

		if (token == "ABRE_PARENTESES") {
			pos1 = analiseListaExpr(pos1 + 1);
			if (pos1 != -1) {
				analiseSemParametrosProc(lexica[pos][1], pos+2, pos1-1, 2); //SEMANTIC
				try {
					token = lexica[pos1][0];
				} catch (error) {
					return -1;
				}

				if (token == "FECHA_PARENTESES") {
					return pos1 + 1
				}
				else return -1;
			}
			else return -1;
		}
		return pos1;
	}
	else return -1;
}

function analiseComandoCond(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "CONDICIONAL") {
		let pos1 = analiseExpressao(pos + 1);
		if (pos1 != -1) {
			analiseSemExpr(pos+1, pos1-1, "TIPO_BOOLEAN",1); //SEMANTIC
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
			if (token == "THEN") {
				pos1 = analiseComando(pos1 + 1);
				if (pos1 != -1) {
					try {
						token = lexica[pos1][0];
					} catch (error) {
						return -1;
					}

					if (token == "SENAO") {
						pos1 = analiseComando(pos1 + 1);
						return pos1;
					}
					else return pos1;
				}
				else return -1;
			}
			else return -1;
		}
		else return -1;
	}
	else return -1;
}


function analiseComandoRep(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "ENQUANTO") {
		let pos1 = analiseExpressao(pos + 1);
		if (pos1 != -1) {
			analiseSemExpr(pos+1, pos1-1, "TIPO_BOOLEAN",1); //SEMANTIC
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
			if (token == "DO") {
				pos1 = analiseComando(pos1 + 1)
				return pos1;
			}
			else return -1;
		}
		else return -1;
	}
	else return -1;
}

function analiseExpressao(pos) {
	let pos1 = analiseExpressaoSimp(pos);
	if (pos1 != -1) {
		let pos2 = analiseRelacao(pos1);
		if (pos2 != -1) {
			pos1 = analiseExpressaoSimp(pos2);
		}
		return pos1;
	}
	else return -1;
}

function analiseRelacao(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "MENOR_IGUAL" || token == "MAIOR_IGUAL" || token == "DIFERENTE" || token == "MENOR" || token == "MAIOR" || token == "OP_IGUAL") {
		return pos + 1;
	}
	else {
		return -1;
	}
}



function analiseExpressaoSimp(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "OP_ADICAO" || token == "OP_SUBT") {
		pos = pos + 1;
	}

	pos1 = analiseTermo(pos);
	if (pos1 != -1) {
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}

		let pos2;

		while (token == "OP_ADICAO" || token == "OP_SUBT" || token == "OU") {
			pos2 = analiseTermo(pos1 + 1);
			if (pos2 != -1) {
				pos1 = pos2;
			}
			else return -1;
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
		}
		return pos1;
	}
	else return -1;
}

function analiseTermo(pos) {
	let pos1 = analiseFator(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return -1;
		}

		let pos2;
		while (token == "OP_DIV" || token == "OP_MULT" || token == "E") {
			pos2 = analiseFator(pos1 + 1);
			if (pos2 != -1) {
				pos1 = pos2;
			}
			else return -1;
			try {
				token = lexica[pos1][0];
			} catch (error) {
				return -1;
			}
		}
		return pos1;
	}
	else return -1;
}

function analiseFator(pos) {
	let pos1 = analiseVariavel(pos);
	let token;
	if (pos1 != -1) {

	}
	else {
		pos1 = analiseNumero(pos);
		if (pos1 != -1) {

		}
		else {
			try {
				token = lexica[pos][0];
			} catch (error) {
				return -1;
			}
			if (token == "ABRE_PARENTESES") {
				pos1 = analiseExpressao(pos + 1);
				if (pos1 != -1) {
					try {
						token = lexica[pos1][0];
					} catch (error) {
						return -1;
					}

					if (token == "FECHA_PARENTESES") {
						return pos1 + 1;
					}
					else return -1;
				}
				else return -1;

			}
			else if (token == "NOT") {
				pos1 = analiseFator(pos + 1);
				return pos1;
			}
			else return -1;
		}
	}
	return pos1;
}


function analiseVariavel(pos) {
	let pos1 = analiseIdentificador(pos);
	if (pos1 != -1) {
		let pos2 = analiseExpressao(pos1);
		if (pos2 != -1) {
			return pos2;
		}
		return pos1;
	}
	else return -1;
}


function analiseNumero(pos) {
	let token;
	try {
		token = lexica[pos][0];
	} catch (error) {
		return -1;
	}

	if (token == "NUM_NAT" || token == "NUM_DEC") {
		return pos + 1;
	}
	else return -1;
}


function analiseListaExpr(pos) {
	let pos1 = analiseExpressao(pos);
	if (pos1 != -1) {
		let token;
		try {
			token = lexica[pos1][0];
		} catch (error) {
			return pos1;
		}

		let pos2 = 0;
		while (token == "VIRGULA") {
			pos2 = analiseExpressao(pos1 + 1);
			if (pos2 != -1) {
				pos1 = pos2;
			}
			else return -1;
			try {
				token = lexica[pos2][0];
			} catch (error) {
				return -1;
			}
		}
		return pos1;
	}
	else return -1;
}

function analiseSintatica() {

	//Pega os dados da área de texto e separa em linhas e então em tokens (que são separados por espaços)
	var text = document.getElementById("text-area-1");
	text = text.value;
	lines = text.split("\n");
	//console.log(lines);

	while (it_linha < lines.length) {
		analiseLexica(lines);
	}

	//console.log(lexica);


	if (contErroLexico > 0) {
		alert("Erro léxico encontrado. Não será possível continuar com a análise sintática.");
	} else {
		if (analiseProgram(0)) {
			//console.log("Sucesso");
			alert("Análise sintática concluída com sucesso! Nenhum erro foi encontrado.");

			for(let i = 0; i < tab_conts[escopo_atual]; i ++){ //SEMANTIC >
				if(tabs_sem[escopo_atual][i][4] == 0){
					if(tabs_sem[escopo_atual][i][3] == 1){
						console.log("AVISO SEMANTICO --> A Variável '" + tabs_sem[escopo_atual][i][0] + "' declarada nunca é usada.");
					}
				}
			} // SEMANTIC <

			return true;
		}
		else {
			//console.log("Erro");
			alert("Erro sintático encontrado!");
			return false;
		}
	}



}


//----------------------------------- FUNÇÕES SEMANTICAS --------------------------------------------


function buscaTabSem(cadeia, categoria){
	for(let i = 0; i < tabs_sem[escopo_atual].length ; i ++){
		
		if((tabs_sem[escopo_atual][i][3] == categoria) && (tabs_sem[escopo_atual][i][0] == cadeia)){
			return i;
		}
	}
	return -1;
}


function atualizaEscopo(flag){
	if(flag == 1){
		escopo_atual ++;
		tabs_sem[escopo_atual] = tabs_sem[escopo_atual - 1].slice();
		tab_conts[escopo_atual] = tab_conts[escopo_atual - 1];
	}
	else{
		for(let i = 0; i < tab_conts[escopo_atual - 1].length; i++){
			if(tabs_sem[escopo_atual - 1][i][3] == 1){
				tabs_sem[escopo_atual - 1][i][6] = tabs_sem[escopo_atual][i][6];
			}
			else{
				tabs_sem[escopo_atual - 1][i][7] = tabs_sem[escopo_atual][i][7];
			}
		}
		for(let i = tab_conts[escopo_atual - 1]; i < tab_conts[escopo_atual]; i ++){
			if(tabs_sem[escopo_atual][i][4] == 0){
				if(tabs_sem[escopo_atual][i][3] == 1){
					console.log("AVISO SEMANTICO --> A Variável '" + tabs_sem[escopo_atual][i][0] + "' declarada nunca é usada.");
				}
			}
		}

		tabs_sem[escopo_atual] = [];
		escopo_atual --;
	}
}



function analiseSemAtrib(pos1, pos2){
	let aux1 = buscaTabSem(lexica[pos1][1], 1);
	let aux2;
	if(aux1 != -1){
		tabs_sem[escopo_atual][aux1][4] = 1;
		aux2 = analiseSemExpr(pos1+2, pos2, tabs_sem[escopo_atual][aux1][5],1);
		tabs_sem[escopo_atual][aux1][6] = "1";
	}
	else{
		console.log("ERRO SEMANTICO --> Variável '" + lexica[pos1][1] + "' não declarada!!");
	}
}


function analiseSemExpr(pos1, pos2, tipo1, sit){
	let aux1;

	switch(tipo1){
		case "TIPO_INTEIRO":
			for(let i = pos1; i <= pos2; i++){
				if(lexica[i][0] == "IDENTIFICADOR"){
					aux1 = buscaTabSem(lexica[i][1], 1);
					if(aux1 != -1){
						tabs_sem[escopo_atual][aux1][4] = 1;
						if(tabs_sem[escopo_atual][aux1][6] == ""){	
							if(sit == 1){
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada não possui valor atribuído!!");
							}
							else{
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não possui valor atribuído!!");
							}
						}
						if(tabs_sem[escopo_atual][aux1][5] != tipo1){
							if(sit == 1){
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não é do tipo: " + tipo1 + "!!");
							}
							else{
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não é do tipo: " + tipo1 + "!!");
							}
						}
					}
					else{
						if(sit == 1){
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não declarada!!");
						}
						else{
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não declarada!!");
						}
					}
				}
				else if(lexica[i][0] == "NUM_REAL"){
					if(sit == 1){
						console.log("ERRO SEMANTICO --> Uma variável do tipo INTEIRO não pode receber um número REAL!");
					}
					else{
						console.log("ERRO SEMANTICO --> Um parâmetro do tipo INTEIRO não pode receber um número REAL!");
					}
				}
				else if(lexica[i][0] == "MENOR_IGUAL" || lexica[i][0] == "MENOR" || lexica[i][0] == "MAIOR_IGUAL" || lexica[i][0] == "MAIOR" || lexica[i][0] == "DIFERENTE" || lexica[i][0] == "BOOLEAN_FALSE" || lexica[i][0] == "BOOLEAN_TRUE" || lexica[i][0] == "E" || lexica[i][0] == "NOT" || lexica[i][0] == "OU"){
					if(sit==1){
						console.log("ERRO SEMANTICO --> Uma variável do tipo INTEIRO não pode receber um valor BOOLEAN!");
					}
					else{
						console.log("ERRO SEMANTICO --> Um parâmetro do tipo INTEIRO não pode receber um valor BOOLEAN!");
					}
				}
			}
			break;
		case "TIPO_REAL":
			for(let i = pos1; i <= pos2; i++){
				if(lexica[i][0] == "IDENTIFICADOR"){
					aux1 = buscaTabSem(lexica[i][1], 1);
					if(aux1 != -1){
						tabs_sem[escopo_atual][aux1][4] = 1;
						if(tabs_sem[escopo_atual][aux1][6] == ""){	
							if(sit == 1){
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada não possui valor atribuído!!");
							}
							else{
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não possui valor atribuído!!");
							}
						}
						if(tabs_sem[escopo_atual][aux1][5] != tipo1){
							if(sit == 1){
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não é do tipo: " + tipo1 + "!!");
							}
							else{
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não é do tipo: " + tipo1 + "!!");
							}
						}
					}
					else{
						if(sit == 1){
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não declarada!!");
						}
						else{
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não declarada!!");
						}
					}
				}
				else if(lexica[i][0] == "NUM_NAT"){
					if(sit == 1){
						console.log("ERRO SEMANTICO --> Uma variável do tipo REAL não pode receber um número NATURAL!");
					}
					else{
						console.log("ERRO SEMANTICO --> Um parâmetro do tipo REAL não pode receber um número NATURAL!");
					}
				}
				else if(lexica[i][0] == "MENOR_IGUAL" || lexica[i][0] == "MENOR" || lexica[i][0] == "MAIOR_IGUAL" || lexica[i][0] == "MAIOR" || lexica[i][0] == "DIFERENTE" || lexica[i][0] == "BOOLEAN_FALSE" || lexica[i][0] == "BOOLEAN_TRUE" || lexica[i][0] == "E" || lexica[i][0] == "NOT" || lexica[i][0] == "OU"){
					if(sit == 1){
						console.log("ERRO SEMANTICO --> Uma variável do tipo REAL não pode receber um valor BOOLEAN!");
					}
					else{
						console.log("ERRO SEMANTICO --> Um parâmetro do tipo REAL não pode receber um valor BOOLEAN!");
					}
				}
			}
			break;
		case "TIPO_BOOLEAN":
			for(let i = pos1; i <= pos2; i++){
				if(lexica[i][0] == "IDENTIFICADOR"){
					aux1 = buscaTabSem(lexica[i][1], 1);
					if(aux1 != -1){
						tabs_sem[escopo_atual][aux1][4] = 1;
						if(tabs_sem[escopo_atual][aux1][6] == ""){	
							if(sit == 1){
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada não possui valor atribuído!!");
							}
							else{
								console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não possui valor atribuído!!");
							}
						}
						if(tabs_sem[escopo_atual][aux1][5] != tipo1){
							//console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não é do tipo: " + tipo1 + "!!");
						}
					}
					else{
						if(sit == 1){
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' não declarada!!");
						}
						else{
							console.log("ERRO SEMANTICO -->Variável '" + lexica[i][1] + "' usada como parâmetro não declarada!!");
						}
					}
				}
				else if(lexica[i][0] == "NUM_REAL" || lexica[i][0] == "NUM_NAT"){
					//console.log("ERRO SEMANTICO --> Uma variável do tipo BOOLEAN não pode receber um valor numérico");
				}
				
			}
			break;
	}
}


function analiseSemParametrosProc(procID, pos1, pos2, flag){	
	if(flag == 1){ // Declaração de Procedimento
		let aux1 = pos2 - 2; //Pula ; e )
		let tipo1 = lexica[aux1][0];
		aux1 = aux1 - 2; // pula : 
		let aux2;
		let aux3 = tab_conts[escopo_atual] - 1;
		while(lexica[aux1][0] != "VAR"){
			//console.log(lexica[aux1][1]);
			aux2 = buscaTabSem(lexica[aux1][1], 1);
			if(aux2 == -1){
				tabs_sem[escopo_atual][tab_conts[escopo_atual]] = [lexica[aux1][1], lexica[aux1][0], escopo_atual, 1, 0, tipo1, '2' , ''];
				tab_conts[escopo_atual] ++;
			}
			else{
				console.log("ERRO SEMANTICO! --> Variável '" + lexica[aux1][1] + "' já declarada!");
			}
			//console.log("KASDKADKSA" + tipo1)
			tabs_sem[escopo_atual][aux3][7].unshift(tipo1);
			aux1 --;
			if(lexica[aux1][0] == "VIRGULA"){
				aux1--;
			}
			else if(lexica[aux1][0] == "PONTO_E_VIRGULA"){
				aux1--;
				tipo1 = lexica[aux1][0];
				aux1 = aux1 - 2;
			}
		}
	}
	else{ //Chamada de procedimento
		let aux4 = buscaTabSem(procID, 2);
		let tipo2;
		let aux5 = pos1;
		let aux6;
		let aux7;
		if(aux4 != -1){
			for(let i = 0; i < tabs_sem[escopo_atual][aux4][7].length ; i++){
				tipo2 = tabs_sem[escopo_atual][aux4][7][i];
				//console.log(tipo2);
				aux6 = aux5;
				while(lexica[aux5][0] != "VIRGULA" && aux5 <= pos2){
					//console.log(lexica[aux5][1]);
					aux5 ++;
				}
				analiseSemExpr(aux6, aux5, tipo2,2);
				if(aux5 > pos2 && i < (tabs_sem[escopo_atual][aux4][7].length - 1)){
					console.log("ERRO SEMANTICO1! --> O número de parâmetros do Procedimento '" + procID + "' está incorreto!");
				}
				aux5++;
			}
			if(aux5 <= pos2){
				console.log("ERRO SEMANTICO2! --> O número de parâmetros do Procedimento '" + procID + "' está incorreto!");
			}
		}
		else{
			console.log("ERRO SEMANTICO! --> O Procedimento '" + procID + "' chamado não foi declarado!");
		}
	}
}