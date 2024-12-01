<template>
  <div class="post-management">
    <h1>Post Management</h1>

    <div class="post-form">
      <h2>Create/Edit Post</h2>
      <form @submit.prevent="savePost">
        <label for="title">Title:</label>
        <input type="text" v-model="newPost.title" required />

        <label for="description">Description:</label>
        <textarea v-model="newPost.description" required></textarea>

        <label for="author">Author:</label>
        <input type="text" v-model="newPost.author" required />

        <button type="submit" class="btn-save">Save Post</button>
      </form>
    </div>

    <div class="all-posts">
      <h2>All Posts</h2>
      <ul>
        <li v-for="(post, index) in posts" :key="index" class="post-item">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-description">{{ post.description }}</div>
          <div class="post-author">Author: {{ post.author }}</div>
          <div class="post-actions">
            <button @click="editPost(index)" class="btn-edit">Edit</button>
            <button @click="removePost(index)" class="btn-remove">Remove</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const newPost = ref({ title: '', description: '', author: '' });
let editingIndex = ref(null);

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/posts');
    posts.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const savePost = async () => {
  try {
    if (editingIndex.value !== null) {
      const response = await axios.put(`http://localhost:8080/posts/${posts.value[editingIndex.value].id}`, newPost.value);
      posts.value[editingIndex.value] = response.data;
      editingIndex.value = null;
    } else {
      const response = await axios.post('http://localhost:8080/posts', newPost.value);
      posts.value.push(response.data);
    }

    newPost.value = { title: '', description: '', author: '' };
  } catch (error) {
    console.error(error);
  }
};

const editPost = (index) => {
  newPost.value = { ...posts.value[index] };
  editingIndex.value = index;
};

const removePost = async (index) => {
  try {
    const response = await axios.delete(`http://localhost:8080/posts/${posts.value[index].id}`);
    if (response.status === 200) {
      posts.value.splice(index, 1);
    } else {
      console.error('Failed to delete post');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchPosts);
</script>

<style>
/* Загальні стилі */
body {
  background-color: #121212; /* Темний фон */
  color: #e0e0e0; /* Світлий текст */
  font-family: 'Roboto', sans-serif; /* Сучасний шрифт */
  margin: 0;
  padding: 0;
}

h1 {
  color: #4caf50; /* Зеленуватий акцент */
  text-align: center;
  font-size: 48px;
  margin: 30px 0;
  font-weight: 600;
}

.post-management {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #1e1e1e; /* Темний фон для секцій */
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2); /* Тінь для глибини */
}

/* Заголовки форм та постів */
h2 {
  color: #ffffff;
  font-size: 26px;
  margin-bottom: 20px;
  font-weight: 500;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #b0b0b0;
}

/* Форми вводу */
input, textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  background-color: #333333;
  color: #ffffff;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border: 2px solid #4caf50; /* Зеленуватий акцент при фокусі */
  background-color: #444444;
}

/* Кнопки */
button {
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #ffffff;
  background-color: #4caf50; /* Основний зелений для кнопок */
}

button:hover {
  background-color: #66bb6a; /* Світліший зелений на ховері */
  transform: translateY(-2px); /* Легкий підйом кнопки */
}

button:active {
  background-color: #388e3c; /* Темніший зелений на кліку */
  transform: translateY(2px); /* Підтиснута кнопка */
}

.btn-edit {
  background-color: #ff9800; /* Помаранчевий для редагування */
}

.btn-remove {
  background-color: #f44336; /* Червоний для видалення */
}

/* Список постів */
.all-posts {
  margin-top: 40px;
}

.post-item {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #333333; /* Темний фон для кожного поста */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.post-item:hover {
  transform: translateY(-4px); /* Легкий ефект підйому при ховері */
}

.post-title {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-description {
  font-size: 16px;
  color: #b0b0b0;
  margin-bottom: 12px;
}

.post-author {
  font-size: 14px;
  font-style: italic;
  color: #4caf50; /* Зеленуватий акцент для автора */
  margin-bottom: 15px;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Мобільні адаптації */
@media (max-width: 768px) {
  .post-management {
    padding: 20px;
  }

  .post-item {
    padding: 15px;
  }

  button {
    width: 100%;
    padding: 15px;
  }

  .post-title {
    font-size: 20px;
  }

  .post-description {
    font-size: 14px;
  }
}
</style>

