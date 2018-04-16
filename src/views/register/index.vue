<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="RegForm" :rules="RegRules" ref="RegForm" label-position="left" label-width="0px" class="card-box login-form">
      <h1 class="title">丫贝试客商家中心<span>欢迎注册</span></h1>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model="RegForm.mobile" autoComplete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="imgNum" class="validateCode">
        <span class="svg-container">
          <svg-icon icon-class="verify" />
        </span>
        <el-input type="text" v-model="RegForm.imgNum" autoComplete="on" placeholder="请输入图形验证码" />
        <img class="show-captcha" :src="'data:image/png;base64,'+imgCode" alt="" @click="changeCaptcha" />
      </el-form-item>
      <el-form-item prop="message" class="validateCode">
        <span class="svg-container">
          <svg-icon icon-class="verify" />
        </span>
        <el-input type="text" v-model.trim="RegForm.message" autoComplete="on" placeholder="请输入短信验证码" />
        <el-button class="show-captcha codeBtn" size="mini" plain @click="getMessage" :disabled="disabled">{{ btntext }}</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType1" v-model.trim="RegForm.password" autoComplete="on" placeholder="请输入8-16位的数字、字母组合密码"></el-input>
        <span class="show-pwd" @click="showPwd('1')">
          <svg-icon icon-class="eyeopen" v-if="pwdType1===''" />
          <svg-icon v-else="pwdType1==='password'" icon-class="eyeclose"></svg-icon>
        </span>
      </el-form-item>
      <el-form-item prop="checkPsw">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType2" @keyup.enter.native="handleLogin" v-model.trim="RegForm.checkPsw" autoComplete="on"
          placeholder="请再次确认密码"></el-input>
        <span class="show-pwd" @click="showPwd('2')">
          <svg-icon icon-class="eyeopen" v-if="pwdType2===''" />
          <svg-icon v-else="pwdType2==='password'" icon-class="eyeclose" />
        </span>
      </el-form-item>
      <el-checkbox class="rule"  v-model="agree">我已认真阅读并同意<a href="#" @click="ruleVisible = true">《用户注册协议》</a></el-checkbox>
      <el-form-item>
        <el-button type="primary" :disabled="!agree" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          注册
        </el-button>
      </el-form-item>
      <div class="goOther">
        <span>已有账号？</span><router-link class="toLogin" to="/login">立即登录</router-link>
        <router-link class="toPsw" to="/changePsw">忘记密码？</router-link>
      </div>
    </el-form>

    <el-dialog class="ruleBox" center :modal-append-to-body="false" :visible.sync="ruleVisible" width="60%" >
      <div class="passage">
      <h2>服务协议</h2>
        <p>一、接受条款</p>
        <span class="pTitle">丫贝（www.yabei.shop）根据以下服务条款为您提供服务。 所提供的各项服务的所有权和运作权归丫贝平台所有。 服务条款的修改权归丫贝平台所有。这些条款可由丫贝随时更新，且毋须另行通知。 丫贝服务协议（以下简称“服务协议”）一旦发生变动，丫贝将在网页上公布修改内容。 修改后的服务协议一旦在网页上公布即有效代替原来的服务协议。 此外，当您使用丫贝特殊服务时，您和丫贝应遵守丫贝随时公布的与该服务相关的指引和规则。 前述所有的指引和规则，均构成本服务协议的一部分。
        您在使用丫贝提供的各项服务之前，应仔细阅读本服务协议。 如您不同意使用本协议或随时对其的修改，请您立即停止使用丫贝网所提供的全部服务； 您一旦使用丫贝服务，即视为您已了解并完全同意本服务协议各项内容， 包括丫贝对本服务协议随时所做的任何修改，并成为丫贝用户（以下简称“用户”）。</span>
        <p>二、服务说明</p>
        <span class="pTitle">丫贝目前向用户提供如下服务：丫贝运用自己开发运营的计算机系统，通过国际互联网络等手段为用户提供折扣优惠信息等网络服务。 丫贝保留变更、中断或终止部分网络服务的权利。 丫贝保留根据实际情况随时调整丫贝平台提供的服务种类、形式。 丫贝不承担因业务调整给用户造成的损失。 除非本服务协议另有其它明示规定，增加或强化目前本服务的任何新功能，包括所推出的新产品，均受到本服务协议之规范。 您了解并同意，本服务仅依其当前所呈现的状况提供，对于任何用户信息或个人化设定之时效、删除、传递错误、未予储存或其它任何问题， 丫贝均不承担任何责任。丫贝保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。</span>
        <p>三、遵守法律</p>
        <span class="pTitle">您同意遵守中华人民共和国相关法律法规的所有规定， 并对以任何方式使用您的密码和您的帐号或是以其他方式使用本服务的任何行为及其结果承担全部责任。 如您的行为违反国家法律和法规的任何规定，有可能构成犯罪的，将被追究刑事责任，并由您承担全部法律责任。
        同时如果丫贝有理由认为您的任何行为，包括但不限于您的任何言论和其它行为违反或可能违反国家法律和法规的任何规定， 丫贝可在任何时候不经任何事先通知终止向您提供服务，如损害了丫贝的利益，丫贝保留进一步追究您责任的权利。 您和丫贝平台均受益于与本网站有关的可预见法律环境的建立。 因此，您和丫贝平台明确同意，因您使用本网站而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖，但不考虑其法律冲突原则。 您同意，如果出现任何因本网站引起或与之相关的争议，您和丫贝平台应首先本着诚信原则通过协商加以解决。 如果协商不成，您将同意接受丫贝平台住所地法院管辖。</span>
        <p>四、您的注册义务</p>
        <span class="pTitle">为了能使用本服务，您同意以下事项：依本服务注册提示请您填写正确的手机号和密码或QQ账号， 并确保今后更新的手机号、头像等资料的有效性和合法性。若您提供任何违法、不道德或丫贝认为不适合在丫贝上展示的资料； 或者丫贝有理由怀疑你的资料属于程序或恶意操作，丫贝有权暂停或关闭您的帐号，并拒绝您于现在和未来使用本服务之全部或任何部分。
        丫贝无须对任何用户的任何登记资料承担任何责任， 包括但不限于鉴别、核实任何登记资料的真实性、正确性、完整性、适用性及/或是否为最新资料的责任。
        丫贝为用户提供对个人注册信息的绝对的控制权，用户可以通过“修改个人信息”查看或修改个人信息。 用户自愿注册个人信息，用户在注册时提供的所有信息，都是基于自愿，用户有权在任何时候拒绝提供这些信息。
        用户不得将其帐号、密码转让或出借予他人使用。如用户发现其帐号遭他人非法使用，应立即更改密码并通知丫贝。 因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用，丫贝不承担任何责任。</span>
        <p>五、用户账号、密码及安全</p>
        <ul>
          <span class="pTitle">完成本服务的注册程序并成功注册之后，您可使用您注册时使用的手机号和密码或QQ账号，登录到您在丫贝的帐号（下称“帐号”）。 保护您的帐号安全，是您的责任。 您应对所有使用您的密码及帐号的活动负完全的责任。您同意：</span>
          <li>1）您的丫贝帐号遭到未获授权的使用，或者发生其它任何安全问题时，您将立即通知丫贝；</li>
          <li>2）每个用户都要对其帐号中的所有行为和事件负全责。您须自行负责对您的丫贝账号和密码保密， 且须对您在该账号和密码下发生的所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、 网上续签协议或购买服务等）承担责任。 丫贝不能也不会对因您未能遵守本款规定而发生的任何损失负责。您理解丫贝对您的请求采取行动需要合理时间， 丫贝对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。</li>
          <li>3）您承诺不以任何违反法律法规或是违反丫贝平台的方式使用您的账号和密码， 上述违法违规行为包括但不限于利用第三方软件获取多个验证码或获取多个账号和密码等方式， 利用病毒或软件攻击丫贝平台，多次恶意使用账号和密码以从丫贝平台获取不当利益等情形。</li>
          <li>4)如有合理理由怀疑您提供的资料错误、不实、过时或不完整的，丫贝有权向您发出询问及/或要求改正的通知，并有权直接做出删除相应资料的处理，直至中止、终止对您提供部分或全部交易平台服务。 丫贝对此不承担任何责任，您将承担因此产生的任何直接或间接损失及不利后果。</span></li>
        </ul>
        <p>六、隐私权政策</p>
        <ul>
          <span class="pTitle">本条款所称之用户隐私包括被法律确认为隐私内容，并符合下述范围的信息：</span>
          <li>1.您注册丫贝或者丫贝手机客户端时，根据网站要求提供的个人信息；</li>
          <li>2.在您使用丫贝服务、参加网站活动、或访问网站网页时，网站自动接收并记录的您浏览器上的服务器数据，包括但不限于IP地址、网站Cookie中的资料及您要求取用的网页记录；</li>
          <li>3.丫贝通过合法途径从商业伙伴处取得的用户个人资料。</li>
          <li>4.丫贝不会向任何人出售或出借您的个人信息，除非事先得到您的许可。</li>
          <li>5.为服务用户的目的，丫贝可能通过使用您的个人信息和需求，向您提供服务，包括但不限于向您发出活动和优惠信息等。</li>
          <li>6.丫贝承诺不公开或透露您的密码、姓名等在本站的非公开信息，除非因用户本人的需要、法律或其他合法程序的要求、服务条款的改变或修订等。</li>
          <li>7.您的个人信息将在下述情况下部分或全部被披露：</li>
          <li>1)经您同意，向第三方披露；</li>
          <li>2)如您是合格的知识产权人并已提起投诉，应被投诉人要求，向被投诉人披露,以便双方处理可能的权利纠纷；</li>
          <li>3)根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</li>
          <li>4)如果您出现违反中国有关法律或者网站政策的情况，需要向第三方披露；</li>
          <li>5)为提供你所要求的产品和服务，而必须和第三方分享您的个人信息；</li>
          <li>6)其他本网站根据法律或者网站政策认为合适的披露。</li>
        </ul>
        <p>七、商家活动及费用规则</p>
        <ul>
          <li>1、丫贝的具体内容由丫贝根据实际情况提供，目前主要提供爆款活动服务。</li>
          <li>2、丫贝提供的部分网络服务针对用户类别进行网络服务收费，商家用户(商家用户分为注册会员和VIP会员， VIP会员享受服务费折扣优势）使用收费网络服务需要向丫贝支付一定的费用。对于收费的网络服务， 丫贝会在商家使用之前给予商家明确的提示，只有商家根据提示确认其愿意支付相关费用，商家才能使用该等收费网络服务。 如商家拒绝支付相关费用，则丫贝有权不向商家提供该等收费网络服务。</li>
          <li>3、商家理解，丫贝仅提供相关的网络服务，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由商家自行负担。</li>
        </ul>
        <p>八、交易规则</p>
        <ul>
          <span class="pTitle">用户承诺通过丫贝与商家进行商品交易的过程中良好遵守如下丫贝交易规则：</span>
          <li>1.浏览商品信息、提交及确认购买推广订单用户在丫贝浏览商品的详细信息页面时，应当仔细阅读商品信息中包含的全部内容，包括但不限于商品的名称、种类、质量、价格、有效期、 优惠券折扣、赏金、佣金比例等内容， 用户完全接受商品信息中包含的全部内容后方可点击购买或推广。
            在商品购买订单生成后，用户应当仔细阅读商家订单页面中所包含的全部内容，包括但不限于商品信息中的全部内容、 选择及确认购买数量、价格、应付总额和接收货物的收货地址、佣金比例等内容。前述购买订单页面中所包含的全部内容， 构成了用户与商家之间达成的商品购买合同的合同内容，用户完全同意商品购买订单的全部内容后方可确认并支付订单。
          </li>
          <li>2.淘客在进行商品推广，在赏金结算时，所提交的信息务必真实无作假，否则丫贝保留处罚权利。 赏金结算只计算活动起止时间内成交商品总数，其余时间内成交量一律不纳入丫贝赏金结算，并且丫贝保留最终解释权。</li>
          <li>3.配送</li>
          <li>丫贝不对配送承担任何责任，商家将会把商品送到用户所指定的收货地址。 因如下情况造成订单延迟或无法配送等，丫贝及商家不承担延迟配送的责任：</li>
          <li>1）用户提供的信息错误、地址不详细等原因导致的；</li>
          <li>2）货物送达后无人签收，导致无法配送或延迟配送的；</li>
          <li>3）情势变更因素导致的；</li>
          <li>4）不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。</li>
          <li>4.退货及退款</li>
          <li>不同的商品适用于不同的退货政策，用户在购买商品前需仔细阅读相关商品的退货政策， 用户在申请退货前应仔细阅读并理解，同时严格按照相关流程和要求完成退货。</li>
          <li>5.交易争议解决规则</li>
          <li>丫贝不对您与商家之间的任何纠纷承担责任。 如用户与商家因商品购买合同的履行发生任何争议， 丫贝可协助用户与商家之间进行争议的协商调解。</li>
        </ul>
        <p>九、用户行为</p>
        <ul>
          <li>1）用户同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶</li>
          <li>* 煽动抗拒、破坏宪法和法律、行政法规实施的；</li>
          <li>* 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
          <li>* 损害国家荣誉和利益的；</li>
          <li>* 煽动民族仇恨、民族歧视、破坏民族团结的；</li>
          <li>* 破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
          <li>* 散布谣言，扰乱社会秩序，破坏社会稳定的；</li>
          <li>* 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
          <li>* 公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；</li>
          <li>* 含有虚假、诈骗、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</li>
          <li>* 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</li>
          <li>* 含有丫贝认为不适合在丫贝展示的内容；</li>
          <li>* 其他违反宪法和法律行政法规的；</li>
          <li>* 为其他团购商户或者任何相关商户进行商业广告行为的；</li>
          <li>2）以任何方式危害他人及丫贝的的合法权益；</li>
          <li>3）冒充其他任何人或机构，或以虚伪不实的方式陈述或谎称与任何人或机构有关；</li>
          <li>4）依据任何法律或合约或法定关系（例如由于雇佣关系和依据保密合约所得知或揭露之内部资料、专属及机密资料） 知悉但无权传送之任何内容加以发布、发送电子邮件或以其它方式传送；</li>
          <li>5）将设计目的在于干扰、破坏或限制任何计算机软件、硬件或通讯设备功能之计算机病毒（包括但不限于木马程序（trojan horses）、蠕虫（worms）、定时炸弹、删除蝇（cancelbots） （以下简称“病毒”）或其它计算机代码、档案和程序之任何资料，加以发布、发送或以其它方式传送；</li>
          <li>6）干扰或破坏本服务或与本服务相连线之服务器和网络，或违反任何关于本服务连线网络之规定、程序、政策或规范；</li>
          <li>7）跟踪、人肉搜索或以其它方式骚扰他人；</li>
          <li>8）故意或非故意地违反任何适用的当地、国家法律，以及任何具有法律效力的规则；</li>
          <li>9）未经合法授权而截获、篡改、收集、储存或删除他人个人信息、站内邮件或其它数据资料，或将获知的此类资料用于任何非法或不正当目的；</li>
          <li>10）利用第三方软件在丫贝平台上获取不当利益或非法所得， 利用病毒或非法软件攻击丫贝平台，或利用非法手段从丫贝获取不当利益等。</li>
          <li>2. 在使用交易平台服务过程中，您承诺遵守以下约定：</li>
          <li>1) 在使用交易平台服务过程中实施的所有行为均遵守国家法律、法规等规范性文件及丫贝网站各项规则的规定和要求， 不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本规则及相关规则。 您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保丫贝免于因此产生任何损失。</li>
          <li>2) 在与商家交易过程中，遵守诚实信用原则，不扰乱网上交易的正常秩序，不从事与网上交易无关的行为。</li>
          <li>3) 不以虚构或歪曲事实的方式不当评价商家，不采取不正当方式制造或提高自身的信用度， 不采取不正当方式制造或提高（降低）商家的信用度。</li>
          <li>4) 不对丫贝网站上的任何数据作商业性利用，包括但不限于在未经丫贝事先书面同意的情况下， 以复制、传播等任何方式使用丫贝网站站上展示的资料。</li>
          <li>5) 不使用任何装置、软件或例行程序干预或试图干预丫贝网站的正常运作或正在丫贝网站上进行的任何交易、活动。</li>
          <li>3. 您了解并同意：</li>
          <li>1) 丫贝有权对您是否违反上述承诺做出单方认定，并根据单方认定结果适用规则予以处理或终止向您提供服务， 且无须征得您的同意或提前通知予您。</li>
          <li>2) 基于维护丫贝网站交易秩序及交易安全的需要， 丫贝有权在发生恶意购买等扰乱市场正常交易秩序的情形下， 执行关闭相应交易订单等操作。</li>
          <li>3) 经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者丫贝根据自身的判断，认为您的行为涉嫌违反本规则和/或其他规则的条款或涉嫌违反法律法规的规定的， 则丫贝有权在丫贝网站上公示您的该等涉嫌违法或违约行为及丫贝已对您采取的措施。</li>
        </ul>
        <p>十、免责声明</p>
        <ul>
          <li>1）丫贝网站有权但无义务，改善或更正本网站任何部分之任何疏漏、错误。</li>
          <li>2）互联网是一个开放平台，用户明确同意其将文字、资讯、资料、音乐、照片、图形、视讯、信息或其它个人资料上传到互联网上，有可能被其他组织或个人复制、转载、或做其它用途的风险完全由其自己承担； 因其使用丫贝服务而产生的一切后果也由其自己承担，丫贝对用户不承担任何责任。</li>
          <li>3）微博、人人网、QQ等官方帐号对用户的相关文字、资讯、资料、音乐、照片、图形、视讯、信息或其它个人资料进行推广发布的， 不属于对用户相关权益的侵权行为，丫贝不承担任何责任。</li>
          <li>4）网站上针对用户的恶意评论，经用户的举报丫贝会采取删除处理，但不保证服务一定能满足用户的要求，也不对该恶意评论负任何法律责任。 丫贝网站对于任何包含、经由或连接、下载或从任何与有关本网站所获得的任何内容、信息或广告， 不声明或保证其正确性或可靠性；并且对于用户经本网站上的内容、广告、展示而购买、取得的任何产品、信息或资料，丫贝网站不负保证责任。 用户自行负担使用本网站的风险。用户从丫贝网站访问其它网站时，将离开丫贝网站。用户在其它网站上所发生的购买或者任何行为，均由用户自己承担风险，丫贝不承担相关的责任。</li>
          <li>5）丫贝不保证服务一定能满足用户的要求，也不保证服务不会中断，对服务的及时性、 安全性、准确性也都不作保证。对于因不可抗力或丫贝无法控制的原因造成的网络服务中断或其他缺陷，丫贝不承担任何责任。丫贝不对用户所发布信息的删除或储存失败承担责任。丫贝有权判断用户的行为是否符合本网站服务协议条款之规定，如果丫贝认为用户违背了协议条款的规定， 丫贝有终止向其提供网站服务的权利 。</li>

        </ul>
        <p>十一、关于使用及储存之一般措施</p>
        <ul>
          <span class="pTitle">您承认关于本服务的使用丫贝有权制订一般措施及限制，包含但不限于本服务将保留所发布内容或其它发布内容之最长期间，以及一定期间内您使用本服务 之次数上限（及每次使用时间之上限）。通过本服务发布或传送之任何信息、通讯资料和其它内容，如被删除或未予储存，您同意丫贝毋须承担任何责任。 您也同意，丫贝有权依其自行之考虑，不论通知与否，随时变更这些一般措施及限制。</span>
        </ul>
        <p>十二、服务变更、中断或终止</p>
        <ul>
          <span class="pTitle">丫贝有权于任何时间暂时或永久修改或终止本服务（或其任何部分），且无论通知与否。 您同意对于本服务所作的任何修改、暂停或终止，丫贝对您和任何第三人均无需承担任何责任。
        如因系统维护或升级的需要而需暂停网络服务、服务功能的调整，丫贝将尽可能事先在网站上进行通告。 如发生下列任何一种情形，丫贝有权单方面中断或终止向用户提供服务而无需通知用户：</span>
          <li>◇ 用户提供的个人资料不真实；</li>
          <li>◇ 用户违反本服务条款中规定的使用规则；</li>
          <li>◇ 未经丫贝同意，将丫贝平台用于商业目的。</li>
          <span class="pTitle">您同意丫贝基于其自行之考虑，因任何理由，包含但不限于缺乏使用，或丫贝认为您已经违反本服务协议的文字及精神，终止您的帐号或本服务之使用 （或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，丫贝可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除， 丫贝对您或任何第三人均不承担任何责任。</span>
        </ul>
        <p>十三、与广告商及其他第三方进行交易</p>
        <span class="pTitle">您通过本网站与广告商及其他第三方进行任何形式的通讯或商业往来，或参与促销活动，包含相关商品或服务之付款及交付，以及达成的其它任何相关条款、 条件、保证或声明，完全为您与广告商及其他第三方之间之行为。 您因前述任何交易或前述广告商及其他第三方而遭受的任何性质的损失或损害，丫贝对此不负任何法律责任。</span>
        <p>十四、版权说明</p>
        <ul>
          <li>1、丫贝提供的网络服务中包含的任何文本、图片、图形、音频或视频资料均受版权、商标和其它财产所有权法律的保护，未经相关权利人同意，上述资料均不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。 丫贝不就由上述资料产生或在传送或递交全部或部分上述资料过程中产生的延误、不准确、错误和遗漏或从中产生或由此产生的任何损害赔偿，以任何形式，向用户或任何第三方负责。</li>
          <li>2、丫贝为提供网络服务而使用的任何软件（包括但不限于软件中所含的任何图象、照片、动画、录像、录音、音乐、文字和附加程序、随附的帮助材料） 的一切权利均属于该软件的著作权人，未经该软件的著作权人许可，用户不得对该软件进行反向工程、反向编译或反汇编。</li>
        </ul>
        <p>十五、担保与保证</p>
        <ul>
          <span class="pTitle">您明确了解并同意∶</span>
          <li>1）本服务协议的任何规定不会免除丫贝对造成您人身伤害的、或因故意或重大过失造成您财产损失的任何责任；</li>
          <li>2）您使用本服务之风险由您个人负担。本服务系依“现状”及“现有”基础提供。丫贝对本服务不提供任何明示或默示的担保或保证， 包含但不限于商业适售性、特定目的之适用性及未侵害他人权利等担保或保证；</li>
          <li>3）丫贝不保证以下事项∶</li>
          <li>* 本服务将符合您的要求；</li>
          <li>* 本服务将不受干扰、及时提供、安全可靠或不会出错；</li>
          <li>* 使用本服务取得之结果正确可靠；</li>
          <li>* 您经由本服务购买或取得之任何产品、服务、资讯或其它信息将符合您的期望；</li>
          <li>4）是否使用本服务下载或取得任何资料应由您自行考虑且自负风险， 因任何资料之下载而导致的您电脑系统之任何损坏或数据流失等后果，由您自行承担；</li>
          <li>5）您自丫贝或经由本服务取得的任何建议或信息，无论是书面或口头形式， 除非本服务协议有明确规定，将不构成本服务协议以外之任何保证。</li>
          <li>6）如果丫贝和/或合作单位使用您提供的肖像、姓名或其他合法权益， 您同意将您的肖像、姓名和/或其他合法权益一并授权给丫贝和/或合作单位使用。</li>
          <li>7）您授权丫贝向您发送商业性信息的权利，即授权允许丫贝通过各种合适的通讯联系方式发送信息， 例如提醒您付款、向您传递各类商品的促销、广告和优惠等信息。</li>
        </ul>
        <p>十六、适用法律</p>
        <span class="pTitle">本协议的订立、执行和解释及争议的解决均应适用中国法律并受中国法院管辖。</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleVisible = false">取 消</el-button>
        <el-button type="primary" @click="ruleVisible = false;agree = true ;">同 意</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    validatePhone,
    validateCaptcha ,
    validPassWord
  } from '@/utils/validate'
  import {
    getCaptcha,
    getMessageCode
  } from "@/api/login"
  import SvgIcon from "../../components/SvgIcon/index";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElDialog from "element-ui/packages/dialog/src/component";
  export default {
    components: {
      ElDialog,
      ElFormItem,
      SvgIcon
    },
    name: 'register',
    data() {
      const validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!validatePhone(value)) {
            callback(new Error('请输入正确格式的手机号'))
          }
          callback()
        }
      };
      const validCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入图片验证码'))
        } else {
          if( !validateCaptcha(value)){
            callback(new Error('请输入正确格式的验证码'))
          }
          callback();
        }
      };
      const validMessage = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入短信验证码'))
        } else {
          if (this.RegForm.imgNum !== '' && this.RegForm.mobile !== '') {
            callback();
          } else {
            callback(new Error('请输入手机号及图片验证码'))
          }
        }
      };
      const validatePass = (rule, value, callback) => {
        if (!validPassWord(value)) {
          callback(new Error('密码为8-16位的数字、字母组合'))
        } else {
          if (this.RegForm.checkPsw !== '') {
            this.$refs.RegForm.validateField('checkPsw');
          }
          callback()
        }
      };
      const validateCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else {
          if (value !== this.RegForm.password) {
            callback(new Error('两次输入密码不一致！'))
          }
          callback()
        }
      };
      return {
        RegForm: {
          mobile: '',
          imgNum: '',
          message: '',
          password: '',
          checkPsw: ''
        },
        RegRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateTel
          }],
          imgNum: [{
            required: true,
            trigger: ' blur',
            validator: validCaptcha
          }],
          message: [{
            required: true,
            trigger: ' blur',
            validator: validMessage
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePass
          }],
          checkPsw: [{
            required: true,
            trigger: 'blur',
            validator: validateCheck
          }]

        },
        agree : false ,
        loading: false,
        pwdType1: 'password',
        pwdType2: 'password',

        // messageWarn : false ,
        // warnText : '',
        imgCode: '',
        userToken: '',
        btntext: '获取验证码',
        disabled: false,
        ruleVisible : false
      }
    },
    mounted() {
      this.changeCaptcha();
    },
    methods: {
      showPwd(type) {
        if( type === '1'){
          if (this.pwdType1 === 'password') {
            this.pwdType1 = ''
          } else {
            this.pwdType1 = 'password'
          }
        }else{
          if (this.pwdType2 === 'password') {
            this.pwdType2 = ''
          } else {
            this.pwdType2 = 'password'
          }
        }

      },
      //图片验证码
      changeCaptcha() {
        getCaptcha().then(res => {
          // console.log(res);
          if (res.data.status === '000000000') {
            this.imgCode = res.data.data.image;
            this.userToken = res.data.data.token;
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      //获取短信验证码
      getMessage() {
        if (this.RegForm.imgNum !== '' && this.RegForm.mobile !== '') {
          this.getPhoneCode(this.RegForm.imgNum);
        } else {
          this.$message({
            message: '请先输入正确的手机号及图片验证码',
            type: 'error',
            center: true
          })
        }


      },
      getPhoneCode(value) {
        let form = new FormData();
        form.append('captcha', value);
        form.append('token', this.userToken);
        getMessageCode(this.RegForm.mobile, form).then(res => {
          // console.log(res);
          if (res.data.status === "000000000") {
            let num = 60;
            let timer = setInterval(() => {
              this.btntext = `重新发送(${num}s)`;
              num--;
              this.disabled = true;
              if (!num) {
                this.btntext = "获取验证码";
                clearInterval(timer);
                this.disabled = false;

              }

            }, 1000);
          } else {
            this.$message({
              message: res.data.message,
              center: true,
              type: 'error'
            });
            this.RegForm.imgNum = '' ;
            this.changeCaptcha();
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~');
          this.RegForm.imgNum = '' ;
          this.changeCaptcha();
        });
      },

      handleLogin() {
        this.$refs.RegForm.validate(valid => {
          if(!this.agree){
            this.$message({
              message : '请确定已认真阅读并同意用户注册协议',
              center : true ,
              type : 'error'
            })
          }
          if (valid && this.agree) {
            this.loading = true;
            let formData = new FormData();
            formData.append('mobile', this.RegForm.mobile);
            formData.append('password', this.RegForm.password);
            formData.append('captcha', this.RegForm.message);
            this.$store.dispatch('Register', formData).then(res => {
              if (res.data.status === '000000000') {
                this.loading = false;
                this.$message({
                  title: '注册成功',
                  message: '注册成功',
                  type: 'success',
                });
                this.$router.push({
                  path: '/'
                })

              } else {
                this.loading = false;
                this.$message({
                  title: '信息错误',
                  message: res.data.message,
                  type: 'error',
                  center : true
                });
                this.RegForm.imgNum = '' ;
                this.changeCaptcha();
              }

            }).catch(() => {
              this.loading = false ;
              this.RegForm.imgNum = '' ;
              this.changeCaptcha();
            })
          } else {
            this.loading = false;
            this.RegForm.imgNum = '' ;
            this.changeCaptcha();
            return false
          }
        })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/login.scss";
  .pop {
    width: 10%;
    height: 10%;
  }

  .el-message__content {
    text-align: center;
    width: 100%;
  }

  .login-container {
    .validateCode {
      .el-input {
        width: 1.6rem;
      }
    }
  }


  .messageWarn {
    font-size: 0.12rem;
    color: #f56c6c;
    line-height: 1;
    padding-top: 0.04rem;
  }
  .rule{

    color : #fff ;
    display : flex ;
    align-items: center;
    .el-checkbox__inner{
      width : 0.12rem ;
      height : 0.12rem ;
    }
    .el-checkbox__label{
      font-size : 0.12rem ;
    }
    a{
      color : #0a6cd6;
    }
  }

  .ruleBox{
    /*height : 7.5rem ;*/
    overflow : hidden ;

    .passage{
      max-height : 4rem ;
      overflow-y : scroll ;
      margin-bottom : 0.1rem ;
      overflow-x : hidden ;
      h2{
        text-align : center ;
      }
      p{
        font-size : 0.16rem ;
        float : left ;
        height : 0.32rem ;
        line-height : 0.32rem ;
        font-weight : bold ;
      }
      .pTitle{
        display : block ;

      }
      ul{
        width : 100% ;
        float : left ;

      }
      span, ul li{
        float : left ;
        font-size : 0.13rem ;
        line-height : 0.22rem ;
        width : 100% ;
        text-indent: 0.26rem ;

      }
    }

    .dialog-footer{
      /*height : 1rem ;*/
      height: 25% ;

      display: flex;
      justify-content: center;
      align-items: center;
      .el-button {
        width : 0.9rem ;
        padding : 0;
        text-align : center ;
        line-height : 0.35rem ;
      }
    }
  }

</style>
