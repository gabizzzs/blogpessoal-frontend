import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl, FormHelperText } from "@material-ui/core"
import './CadastroPost.css';
import { useNavigate, useParams } from 'react-router-dom';
import Tema from '../../../models/Tema';
import Postagem from '../../../models/Postagem';
import { busca, buscaId, post, put } from '../../../services/Service';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';
import User from '../../../models/User';

function CadastroPost() {
 
    let history = useNavigate();
    const { id } = useParams <{id: string}>();
    const token = useSelector<TokenState, TokenState["tokens"]>(
      (state) => state.tokens
  );
    const [temas, setTemas] = useState<Tema[]>([])

    useEffect(() => {
        if(token == '') {
          toast.error('Você precisa estar logado!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
            progress: undefined,
        });
            history("/login")
        }
    }, [token])

    const[tema, setTema] = useState<Tema>({
        id: 0,
        descricao: '',
    })

    const userId= useSelector<TokenState, TokenState['id']>(
      (state) => state.id
    )

    const [postagem, setPostagem] = useState<Postagem>({
        id: 0,
        titulo: '',
        texto: '',
        data: '',
        tema: null,
        usuario: null
    })

    const [usuario, setUsuario] = useState<User>({
      id: +userId,
      nome: '',
      usuario:'',
      senha:'',
      foto:''
    })

    useEffect(() => { 
        setPostagem({
            ...postagem,
            tema: tema,
            usuario: usuario
        })
    }, [tema])

    async function findByIdPostagem(id: string) {
        await buscaId(`postagens/${id}`, setPostagem, {
          headers: {
            Authorization: token,
          },
        });
      }
    
      useEffect(() => {
        getTemas();
        if (id !== undefined) {
          findByIdPostagem(id);
        }
      }, [id]);
    
      async function getTemas() {
        await busca('/temas', setTemas, {
          headers: {
            Authorization: token,
          },
        });
      }
    
      function updatedPostagem(event: ChangeEvent<HTMLInputElement>) {
        setPostagem({
          ...postagem,
          [event.target.name]: event.target.value,
          tema: tema,
        });
      }
    
      async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
    
        if (id !== undefined) {
          try {
            await put('/postagens', postagem, setPostagem, {
              headers: {
                'Authorization': token,
              },
            });
            toast.success('Postagem atualizada com sucesso!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "colored",
              progress: undefined,
          });
          } catch (error) {
            toast.error('Erro ao atualizar, verifique os campos', {
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
        } else {
          try {
            await post('/postagens', postagem, setPostagem, {
              headers: {
                'Authorization': token,
              },
            });
            toast.success('Postagem cadastrada com sucesso!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "colored",
              progress: undefined,
          });
          } catch (error) {
            toast.error('Erro ao cadastrar, verifique os campos', {
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
        history('/posts');
      }

    return (
        <Container maxWidth="sm" className="topo">
            <form onSubmit={onSubmit}>
                <Typography variant="h3" color="textSecondary" component="h1" align="center" >Formulário de cadastro postagem</Typography>
                <TextField value={postagem.titulo} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)} id="titulo" label="titulo" variant="outlined" name="titulo" margin="normal" fullWidth />
                <TextField value={postagem.texto} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)} id="texto" label="texto" name="texto" variant="outlined" margin="normal" fullWidth />

                <FormControl variant='outlined' >
                    <InputLabel id="demo-simple-select-helper-label">Tema </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        fullWidth
                        onChange={(e) =>
                            buscaId(`/temas/${e.target.value}`, setTema, {
                                headers: {
                                    Authorization: token,
                                   },
                            })
                   }>
                    {temas.map((item) => (
                    <MenuItem value={item.id} style={{display: 'block'}}>{item.descricao}</MenuItem>
                    ))}
                    </Select>
                    <FormHelperText>Escolha um tema para a postagem</FormHelperText>
                    <Button type="submit" variant="contained" color="primary" disabled={tema.id === 0}>
                        Finalizar
                    </Button>
                </FormControl>
            </form>
        </Container>
    )
}
export default CadastroPost;