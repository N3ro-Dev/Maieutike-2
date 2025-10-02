import React, { useState, useEffect } from 'react';

export default function App() {
  // perfis de exemplo
  const [users] = useState([
    { id: 1, name: 'Ana (Professora)', role: 'teacher', bio: 'Prof. de banco de dados — Álgebra e Cálculo', subjects: ['Matemática', 'Cálculo'] },
    { id: 2, name: 'Bruno (Aluno)', role: 'student', bio: 'Estudante  — busca reforço em estatística', subjects: ['Estatística'] },
    { id: 3, name: 'Carla (Professora)', role: 'teacher', bio: 'Profª de Seguraça de rede — redes', subjects: ['História'] },
  ]);

  // feed / posts
  const [posts, setPosts] = useState([
    { id: 1, author: users[0], title: 'Dúvida sobre integrais', content: 'Alguém pode explicar Como usar o React?', tags: ['internet e protocolos', 'Cálculo'] },
    { id: 2, author: users[1], title: 'Material de Estatística', content: 'Procuro slides sobre regressão linear.', tags: ['Banco de dados'] },
  ]);

  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  // filtragem simples
  const filteredPosts = posts.filter(p => {
    const matchesQuery = [p.title, p.content, p.tags.join(' '), p.author.name].join(' ').toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  // criação de post (local)
  function createPost({ title, content, tags, authorId }) {
    const author = users.find(u => u.id === Number(authorId)) || users[0];
    const newPost = { id: Date.now(), author, title, content, tags };
    setPosts(prev => [newPost, ...prev]);
    setShowCreate(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header onSearch={setQuery} onOpenCreate={() => setShowCreate(true)} />
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <ProfileCard user={users[1]} />
          <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-2">Filtrar por papel</h3>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded-md ${filterRole==='all'?'bg-indigo-600 text-white':'bg-gray-100'}`} onClick={()=>setFilterRole('all')}>Todos</button>
              <button className={`px-3 py-1 rounded-md ${filterRole==='teacher'?'bg-indigo-600 text-white':'bg-gray-100'}`} onClick={()=>setFilterRole('teacher')}>Professores</button>
              <button className={`px-3 py-1 rounded-md ${filterRole==='student'?'bg-indigo-600 text-white':'bg-gray-100'}`} onClick={()=>setFilterRole('student')}>Alunos</button>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Conectar</h3>
            <div className="flex flex-col gap-3">
              {users.filter(u => filterRole==='all' ? true : u.role===filterRole).map(u => (
                <div key={u.id} className="p-2 rounded-md hover:bg-gray-50 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium">{u.name[0]}</div>
                  <div>
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.role === 'teacher' ? 'Professor(a)' : 'Aluno(a)'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Feed de Conhecimento</h2>
              <div className="text-sm text-gray-500">{filteredPosts.length} posts</div>
            </div>

            <div className="space-y-4">
              {filteredPosts.map(p => (
                <PostCard key={p.id} post={p} onReply={(reply) => {
                  // funcionalidade de resposta local (append)
                  setPosts(prev => prev.map(x => x.id === p.id ? { ...x, replies: [...(x.replies||[]), reply] } : x));
                }} />
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Explorar tópicos</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(posts.flatMap(p => p.tags))].map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 border rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-1">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-2">Atalhos</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Grupos por matéria</li>
              <li>Eventos (aulas, lives)</li>
              <li>Mensagens diretas</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-2">Perfil</h3>
            <div className="text-sm text-gray-600">Role switching demo</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 rounded-md bg-gray-100">Entrar como Aluno</button>
              <button className="px-3 py-1 rounded-md bg-gray-100">Entrar como Professor</button>
            </div>
          </div>
        </aside>
      </div>

      {showCreate && <CreatePostModal users={users} onClose={()=>setShowCreate(false)} onCreate={createPost} />}

      <footer className="mt-8 py-6 text-center text-sm text-gray-500">RedeConhecimento — Conectando alunos e professores</footer>
    </div>
  );
}

function Header({ onSearch = ()=>{}, onOpenCreate = ()=>{} }){
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-indigo-600">RedeConhecimento</div>
          <div className="hidden sm:block text-sm text-gray-600">Troca de conhecimento — alunos e professores</div>
        </div>

        <div className="flex items-center gap-3">
          <input onChange={e=>onSearch(e.target.value)} placeholder="Pesquisar posts, pessoas, matérias..." className="px-3 py-2 border rounded-md w-72 text-sm" />
          <button onClick={onOpenCreate} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Criar</button>
        </div>
      </div>
    </header>
  );
}

function ProfileCard({ user }){
  if(!user) return null;
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-medium">{user.name[0]}</div>
      <div>
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-gray-500">{user.role === 'teacher' ? 'Professor(a)' : 'Aluno(a)'}</div>
        <div className="text-xs mt-2 text-gray-600">{user.bio}</div>
      </div>
    </div>
  );
}

function PostCard({ post, onReply }){
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  return (
    <article className="p-4 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{post.title}</div>
          <div className="text-xs text-gray-500">por {post.author.name}</div>
        </div>
        <div className="text-xs text-gray-400">{post.tags.map(t=>`#${t} `)}</div>
      </div>

      <p className="mt-3 text-sm text-gray-700">{post.content}</p>

      <div className="mt-3 flex items-center gap-3">
        <button className="text-sm px-2 py-1 rounded-md bg-gray-100" onClick={()=>setShowReply(s => !s)}>Responder</button>
        <button className="text-sm px-2 py-1 rounded-md bg-gray-100">Salvar</button>
      </div>

      {showReply && (
        <div className="mt-3">
          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Escreva sua resposta..."></textarea>
          <div className="mt-2 flex gap-2 justify-end">
            <button className="px-3 py-1 rounded-md bg-gray-100" onClick={()=>{ setReplyText(''); setShowReply(false); }}>Cancelar</button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white" onClick={()=>{ if(replyText.trim()){ onReply({ id: Date.now(), text: replyText }); setReplyText(''); setShowReply(false); } }}>Enviar</button>
          </div>
        </div>
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="mt-3 border-t pt-3">
          {post.replies.map(r => (
            <div key={r.id} className="text-sm text-gray-700 py-1">{r.text}</div>
          ))}
        </div>
      )}
    </article>
  );
}

function CreatePostModal({ users, onClose, onCreate }){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [authorId, setAuthorId] = useState(users[0]?.id || '');

  function handleSubmit(){
    const tags = tagsText.split(',').map(t=>t.trim()).filter(Boolean);
    if(!title || !content) return alert('Título e conteúdo são obrigatórios');
    onCreate({ title, content, tags, authorId });
    setTitle(''); setContent(''); setTagsText('');
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Criar post</h3>
          <button onClick={onClose} className="text-gray-500">Fechar</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="p-2 border rounded-md" />
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Conteúdo" className="p-2 border rounded-md h-32" />
          <input value={tagsText} onChange={e=>setTagsText(e.target.value)} placeholder="Tags (separadas por vírgula)" className="p-2 border rounded-md" />

          <div className="flex items-center justify-between">
            <select value={authorId} onChange={e=>setAuthorId(e.target.value)} className="p-2 border rounded-md">
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-100">Cancelar</button>
              <button onClick={handleSubmit} className="px-3 py-1 rounded-md bg-indigo-600 text-white">Publicar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

