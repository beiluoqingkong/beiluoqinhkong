# 毕业设计-课程思政案例分享平台-启动须知



### （1）Git代码到本地

<img src="https://typora-aliyun01.oss-cn-hangzhou.aliyuncs.com/img/image-20230514215051718.png" alt="image-20230514215051718" style="zoom:67%;" />

后台代码在"wang"分支中，可以直接Git下载，不需要再转换模板了，直接启动即可。

后台管理端的前端代码在"wang / FrontEnd / mooho-template-admin-plus"中，使用"==npm run dev=="启动

功能端的前端代码在"frontend"分支中，也是直接Git下载，使用"==npm run serve=="启动

### （2）部署Apache服务器

启动本项目需要使用Apache服务器，安装教程可以参考：https://blog.csdn.net/weixin_42512684/article/details/124266837

Apache部署好之后，记住Apache的安装目录，在Apache的安装目录下可以找到htdocs文件夹，在htdocs文件夹下新建ideo_resource文件夹

<img src="https://typora-aliyun01.oss-cn-hangzhou.aliyuncs.com/img/image-20230514222920403.png" alt="image-20230514222920403" style="zoom:67%;" />

进入下图中的代码（fz_ideo.API / ResourceController.cs / upload），修改filePath这行为：

```c#
var filePath = "你的Apache安装目录\htdocs\ideo_resource\";
```

![image-20230514221258120](https://typora-aliyun01.oss-cn-hangzhou.aliyuncs.com/img/image-20230514221258120.png)

前端运行时可能爆出跨域访问异常，这个在前端配置change origin也可以解决，但是后台管理端Mooho-admin-plus中修改起来很不方便，既然Apache服务器在本地，那么可以直接配置Apache的跨域： [Apache解决跨域问题_apache 跨域_疆~的博客-CSDN博客](https://blog.csdn.net/qq_40323256/article/details/124438138)

测试Apache是否部署成功，可以直接在浏览器输入 127.0.0.1，可以看到

<img src="https://typora-aliyun01.oss-cn-hangzhou.aliyuncs.com/img/image-20230514223157146.png" alt="image-20230514223157146" style="zoom:67%;" />

### （3）安装KKFileView

vue在前端预览pdf、word、视频时都有现成的组件，但是预览ppt需要使用公共域名搭配微软接口才能正常运行。由于我们的Apache是本地运行的，不具备公共域名，所以网上给出的解法是先在后台将ppt转为pdf，再转为html，前端直接运行html，但是这个难度太大

所以我直接花¥99买了==KKFileView==，它是打包好的一个后台服务，直接提供了ppt、word等文件转换为html的接口，方便文件的预览

这个的话，可以在百度网盘下载：

```java
链接：https://pan.baidu.com/s/1so3EjbT3r76T_BJQEk4a6w 
提取码：bsho
```

下载完成后直接解压，进入bin目录，==双击startup.bat即可==，这个服务占用8136端口，使用前保证8136端口未被占用

启动后会打开一个黑窗口，==保持窗口不要关闭==，关闭窗口就是关闭服务了

<img src="https://typora-aliyun01.oss-cn-hangzhou.aliyuncs.com/img/image-20230514224424243.png" alt="image-20230514224424243" style="zoom:67%;" />



这三个环境配置好之后，就可以成功启动项目了