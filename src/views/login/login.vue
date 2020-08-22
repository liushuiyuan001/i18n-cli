<template>
  <div class="login">
    <div class="head">
      <img class="head-img" src="../../assets/images/logo/logo-56.png" alt="logo" />
      <div class="head-right flex-row">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            help<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">{{$t('login.introduction')}}</el-dropdown-item>
            <el-dropdown-item command="b">{{$t('login.manual')}}</el-dropdown-item>
            <el-dropdown-item command="c">{{$t('login.contact')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button-group>
          <el-button size="small" @click="changeLang('en')" :class="{'active':lang=='en'}">EN</el-button>
          <el-button size="small" @click="changeLang('cn')" :class="{'active':lang=='cn'}">中文</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="content">
      <div class="content-login">
        <div class="content-left">
          <div class="content-left-logo">
            <img src="../../assets/images/logo/logo-login.png" />
          </div>
          <div class="content-left-top">
            <span class="content-left-welcome black-text">{{$t('login.welcome')}}</span>
            <span class="content-left-title main-text">{{$t('login.title')}}</span>
          </div>
          <div class="content-left-bottom">
            <div class="product-presentation">
              <i class="product-presentation-img icon-login_intro"></i>
              <span class="product-presentation-text main-text"><a class="main-text">{{$t('login.introduction')}}</a></span>
            </div>
            <div class="user-manual">
              <i class="user-manual-img icon-login_manual"></i>
              <span class="user-manual-text main-text"><a class="main-text">{{$t('login.manual')}}</a></span>
            </div>
            <div class="contact-us">
              <i class="contact-us-img icon-login_email"></i>
              <span class="contact-us-text main-text"><a class="main-text">{{$t('login.contact')}}</a></span>
            </div>
          </div>
        </div>
        <div class="content-right">
          <el-form class="content-right-form">
            <el-form-item>
              <el-input type="text" name="username" :placeholder="$t('login.username')" v-model="username"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" name="password" :placeholder="$t('login.password')" v-model="password"></el-input>
            </el-form-item>
            <el-form-item>
              <a @click="handleForgetPassword">{{$t('login.forget')}}</a>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin" style="width: 100%">{{$t('login.login')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>