import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Postagem from '../../../models/Postagem';
import { busca } from '../../../services/Service';
import { TokenState } from '../../../store/tokens/tokensReducer';
import './ListaPostagem.css'

function ListaPostagem() {

  const [posts, setPosts] = useState<Postagem[]>([])
  const token = useSelector<TokenState, TokenState["tokens"]>(
    (state) => state.tokens
  );
  let history = useNavigate();

  const userId = useSelector<TokenState, TokenState['id']>((state) => state.id);

  useEffect(() => {
    if (token == "") {
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

  async function getPost() {
    await busca("/postagens", setPosts, {
      headers: {
        'Authorization': token
      }
    })
  }

  useEffect(() => {

    getPost()

  }, [posts.length])

    return (
      <>
      {posts.map((post) => (
        <Box m={2} key={post.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Postagens
              </Typography>
              <Typography variant="h5" component="h2">
                {post.titulo}
              </Typography>
              <Typography variant="body2" component="p">
                {post.texto}
              </Typography>
              <Typography variant="body2" component="p">
                {post.tema?.descricao}
              </Typography>
              <Typography variant="body2" component="p">
                Postado por: {post.usuario?.nome}
              </Typography>
            </CardContent>
            <CardActions>
              {post.usuario?.id === +userId ? (
                <Box display="flex" justifyContent="center" mb={1.5}>
                  <Link
                    to={`/formularioPostagem/${post.id}`}
                    className="text-decoration-none"
                  >
                    <Box mx={1}>
                      <Button variant="contained" size="small" color="primary">
                        atualizar
                      </Button>
                    </Box>
                  </Link>
                  <Link
                    to={`/deletarPostagem/${post.id}`}
                    className="text-decoration-none"
                  >
                    <Box mx={1}>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                      >
                        deletar
                      </Button>
                    </Box>
                  </Link>
                </Box>
              ) : (
                <></>
              )}
            </CardActions>
          </Card>
        </Box>
      ))}
    </>
      )
  }
  
  export default ListaPostagem;