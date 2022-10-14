import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import './CadastroUsuario.css';
import User from '../../models/User';
import { cadastroUsuario } from '../../services/Service';
import { toast } from 'react-toastify';

function CadastroUsuario() {

        let history = useNavigate();
        const [confirmarSenha,setConfirmarSenha] = useState<String>("")
        const [user, setUser] = useState<User>(
            {
                id: 0,
                nome: '',
                usuario: '',
                senha: '',
                foto: ''
            })

        const [userResult, setUserResult] = useState<User>(
            {
                id: 0,
                nome: '',
                usuario: '',
                senha: '',
                foto: ''
            })

        useEffect(() => {
            if (userResult.id !== 0) {
                history("/login")
            }
        }, [userResult])


        function confirmarSenhaHandle(e: ChangeEvent<HTMLInputElement>){
            setConfirmarSenha(e.target.value)
        }

        function updatedModel(e: ChangeEvent<HTMLInputElement>) {

            setUser({
                ...user,
                [e.target.name]: e.target.value
            })
    
        }
        async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
            e.preventDefault()
            if(confirmarSenha == user.senha){
            cadastroUsuario(`/usuarios/cadastrar`, user, setUserResult)
            toast.success('Usuário cadastrado com sucesso!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
            }else{
                toast.error('Dados inconsistentes. Favor verificar as informações de cadastro.', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "colored",
                    progress: undefined,
                });
            }
        }


    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid item xs={6} className='imagem2'></Grid>
            <Grid item xs={6} alignItems='center'>
                <Box padding={10}>
                    <form onSubmit={onSubmit}>
                            <Typography variant ='h3' gutterBottom color='textPrimary' component='h3' align='center' className='textos2' >Cadastrar</Typography>
                            <TextField required value={user.nome} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} id='nome' label='Nome Completo' variant='outlined' name='nome' margin='normal' fullWidth />
                            <TextField required value={user.usuario} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} id='usuario' label='Usuário' variant='outlined' name='usuario' margin='normal' fullWidth />
                            <TextField value={user.foto} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} id='foto' label='Foto (url)' variant='outlined' name='foto' margin='normal' fullWidth />
                            <TextField required value={user.senha} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedModel(e)} id='senha' label='Senha' variant='outlined' name='senha' margin='normal' type='password' fullWidth />
                            <TextField required value={confirmarSenha} onChange={(e: ChangeEvent<HTMLInputElement>) => confirmarSenhaHandle(e)} id='confirmarSenha' label='Confirmar Senha' variant='outlined' name='confirmarSenha' margin='normal' type='password' fullWidth />
                            <Box marginTop={2} textAlign='center'>
                                <Link to='/login' className='text-decorator-none'>
                                    <Button variant='contained' color='secondary' className='btnCancelar'>
                                        Cancelar
                                    </Button>
                                </Link>
                                    <Button type='submit' variant='contained' color='primary'>
                                        Cadastrar
                                    </Button>
                            </Box>
                        </form>
                </Box>
            </Grid>
        

        </Grid>
    );
}

export default CadastroUsuario;