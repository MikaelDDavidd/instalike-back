import {getTodosPosts, criarPost, atualizarPost} from "../models/posts_model.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/gemini_service.js";

export async function listarPosts(req, res) {
  // Chama a função getTodosPosts para buscar os posts do banco de dados.
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (OK).
  res.status(200).json(posts);
}

export async function postarNovoPost(req, res){
  const novoPost = req.body
  try {
      const postCridado = await criarPost(novoPost);
      res.status(200).json(postCridado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Error": "Falha na Requisição"});
  }
}

export async function uploadImagem(req, res){
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  try {
      const postCridado = await criarPost(novoPost);
      const imagemAtualuizada = `uploads/${postCridado.insertedId}.png`;
      fs.renameSync(req.file.path, imagemAtualuizada);
      res.status(200).json(postCridado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Error": "Falha na Requisição"});
  }
}

export async function atualizarNovoPost(req, res){
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imageBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
      const postCridado = await atualizarPost(id, post);
      res.status(200).json(postCridado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Error": "Falha na Requisição"});
  }
}

