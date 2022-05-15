import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from './UserHome.module.css';

const UserHome = () => {
    return (
        <div id={'container'} className={Styles.container}>
            <div id={'home'} className={'justify-content-center'}>
                <h1 className={Styles.title}>QuizApp, your daily revision destination.</h1>
                <br/>

                <div className={"justify-content-center text-center"}>

                    <div className={"text-center"}>
                        <img src="about.png" width="1000" />
                    </div>

                    <br/><br/>

                    <div className={'w-20'}>
                        <p className={''}>Our app is aimed towards people that are at university wanting to have a daily way to help
                            with revision. Revision styles have changed rapidly over the recent few years as studying online and
                            from
                            home has become a lot more popular due to the Coronavirus pandemic, which started at the start of 2020.
                            During this period when people were trapped inside due to isolation restrictions, people would use
                            online software to study. This principle is why we wanted to create an app to be able to help people do
                            quick revision with little quizzes on different topics/themes. We also hope with this web application to
                            create a learning community that helps promote stress free and easy revision or learning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHome;