/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('GET', 'http://localhost:3000/usuarios').then((response) => {
    const Joi = require('joi');
     });
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.eq(200);
               expect(response.body.usuarios).to.be.an('array').and.not.to.not.be.empty;

               const usuarios = response.body.usuarios;
               usuarios.forEach((usuario) => {
                    cy.log(`Nome: ${usuario.nome}, E-mail: ${usuario.email}`);
               })

          })

     });

     it('Deve cadastrar um usuário com sucesso', () => {
          const randomString = Math.random().toString(36).substring(7);
          const email = `exemplo${randomString}@teste.com`;
          const novoUsuario = {
               nome: 'Exemplo',
               email: email,
               password: '123456',
               administrador: 'false'
          };

          cy.request('POST', '/usuarios', novoUsuario)
               .then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.property('_id').that.is.not.empty;

                    const userId = response.body._id;

                    cy.request('GET', `/usuarios/${userId}`)
                         .then((getResponse) => {
                              expect(getResponse.status).to.eq(200);
                              expect(getResponse.body).to.have.property('email', email)
                         });
               });

     });

     it('Deve validar um usuário com email inválido', () => {
          const usuarioInvalido = {
               nome: 'Usuário Inválido',
               email: 'email_invalido',
               senha: '123456',
          };
          cy.request({
               method: 'POST',
               url: '/usuarios',
               body: usuarioInvalido,
               failOnStatusCode: false,
          }).then((response) => {
               expect(response.status).to.eq(400);
               expect(response.body).to.have.property('email', 'email deve ser um email válido');
          });
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('GET', '/usuarios').then((response) => {
               expect(response.status).to.eq(200);
               expect(response.body).to.have.property('usuarios').that.is.an('array').and.to.have.length.greaterThan(0);

               const usuarios = response.body.usuarios;
               const usuarioId = usuarios[Math.floor(Math.random() * usuarios.length)]._id;
               const dadosAtualizados = {
                    "nome": "Fulano da Silva",
                    "email": "beltrano2@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               };

               cy.request('PUT', `/usuarios/${'8rdWoA4Bk306Yh2v'}`, dadosAtualizados)
                    .then((response) => {
                         expect(response.status).to.eq(200);
                         expect(response.body).to.have.property('message', 'Registro alterado com sucesso');
                    });




          });
     });

     it('Deve cadastrar e deletar um usuário', () => {
          const usuario = {
               nome: 'teste',
               email: 'teste@usuario.com',
               password: '123456',
               administrador: 'false'
             };
         
             cy.request('POST', '/usuarios', usuario).then((response) => {
               expect(response.status).to.eq(201);
               const usuarioId = response.body._id;
               expect(response.body.message).to.eq('Cadastro realizado com sucesso');
         
               cy.request('DELETE', `/usuarios/${usuarioId}`).then((response) => {
                 expect(response.status).to.eq(200);
                 expect(response.body.message).to.eq('Registro excluído com sucesso');
               });
          });
          
     
          });    

});
