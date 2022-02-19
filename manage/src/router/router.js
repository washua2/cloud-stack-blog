export const routes = [{
        path: '/',
        redirect: '/login'
    },
    {

        path: '/register',
        name: 'Register',
        component: () =>
            import ('../views/Register.vue')
    },

    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/changePassowrd',
        name: 'ChangePassowrd',
        component: () =>
            import ('../views/ChangePassowrd.vue')
    },
    {
        path: '/forget',
        name: 'Forget',
        component: () =>
            import ('../views/Forget.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () =>
            import ('../views/Main.vue'),
        children: [{
                redirect: "/visualization",
                path: "/main"
            },
            {
                path: "/visualization",
                name: "Visualization",
                component: () =>
                    import ('../views/Visualization.vue')
            },
            {
                path: "/addmessage",
                name: "AddMessage",
                component: () =>
                    import ('../views/AddMessage.vue')
            },
            {
                path: "/information",
                name: "Information",
                component: () =>
                    import ('../views/Information.vue')
            },
            {
                path: "/Article",
                name: "Article",
                component: () =>
                    import ('../views/Article.vue')
            },
            {
                path: "/demo",
                name: "Demo",
                component: () =>
                    import ('../views/Demo.vue')
            },
            {
                path: "/addPhoto",
                name: "AddPhoto",
                component: () =>
                    import ('../views/AddPhoto.vue')
            },
            {
                path: "/photoList",
                name: "PhotoList",
                component: () =>
                    import ('../views/PhotoList.vue')
            },
            {
                path: "/reply",
                name: "Reply",
                component: () =>
                    import ('../views/Reply.vue')
            },
            {
                path: "/replyList",
                name: "ReplyList",
                component: () =>
                    import ('../views/ReplyList.vue')
            },
            {
                path: "/userList",
                name: "UserList",
                component: () =>
                    import ('../views/userList.vue')
            },
            {
                path: "/addArticleType",
                name: "AddArticleType",
                component: () =>
                    import ('../views/AddArticleType.vue')
            },
            {
                path: "/articleAlassification",
                name: "ArticleAlassification",
                component: () =>
                    import ('../views/ArticleAlassification.vue')
            },
            {
                path: "/addArticle",
                name: "AddArticle",
                component: () =>
                    import ('../views/AddArticle.vue')
            },
            {
                path: "/FindArticle",
                name: "FindArticle",
                component: () =>
                    import ('../views/FindArticle.vue')
            },
            {
                path: "/journal",
                name: "Journal",
                component: () =>
                    import ('../views/Journal.vue')
            },
            {
                path: "/cancellation",
                name: "Cancellation",
                component: () =>
                    import ('../views/Cancellation.vue')
            },
            {
                path: "/personalInformation",
                name: "PersonalInformation",
                component: () =>
                    import ('../views/PersonalInformation.vue')
            }


        ]
    }

]