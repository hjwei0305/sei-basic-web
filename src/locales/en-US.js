import pwa from './en-US/pwa';
import login from './en-US/login';
import appModule from './en-US/appModule';
import menu from './en-US/menu';
import feature from './en-US/feature';

export default {
  'app.request.error': 'Interface request exception',
  'app.request.info': 'Request info',
  'app.request.401': 'Session exception',
  'app.request.401。message': 'The current session timed out or failed, Please log in again',
  ...pwa,
  ...appModule,
  ...login,
  ...menu,
  ...feature,
  'global.tenant.required': 'Please t!',
  'global.operation': 'Action',
  'global.code': 'Code',
  'global.code.tip': 'Rule: capitalize the initial of each character',
  'global.code.required': 'Code is required',
  'global.name': 'Name',
  'global.name.required': 'Name is required',
  'global.remark': 'Remark',
  'global.remark.required': 'Remark is required',
  'global.frozen': 'Frozen',
  'global.freezing': 'Freezing',
  'global.add': 'New',
  'global.edit': 'Edit',
  'global.save': 'Save',
  'global.ok': 'OK',
  'global.rank': 'Rank',
  'global.back': 'Go Back',
  'global.search': 'Type keyword to query',
  'global.search.code_name': 'Type code or name to query',
  'global.rank.required': 'Rank is required',
  'global.delete': 'Delete',
  'global.refresh': 'Refresh',
  'global.delete.confirm': 'Are you sure to delete it?',
  'global.remove.confirm': 'Are you sure to remove it?',
  'global.save-success': 'Save successfully',
  'global.delete-success': 'Delete successfully',
  'global.assign-success': 'Assign successfully',
  'global.remove-success': 'Remove successfully',
  basic_000000: 'basic information',
  basic_000001: 'account information',
  basic_000002: 'payment information',
  basic_000003: 'position information',
  basic_000004: 'email reminder',
  basic_000005: 'function permission',
  basic_000006: 'Data permission',
  basic_000007: 'change password',
  basic_000008:
    'the password must contain at least 2 kinds of letters, numbers and special characters, and the length of the password cannot be less than 8 digits',
  basic_000009:
    'to ensure the security of your account, please fill in the original password before changing the password',
  basic_000010: 'original password',
  basic_000011: 'please fill in the original password!',
  basic_000012: 'new password',
  basic_000013: 'confirm new password',
  basic_000014: 'modify now',
  basic_000015: 'position code',
  basic_000016: 'position name',
  basic_000017: 'position category',
  basic_000018: 'organization',
  basic_000019: 'operation',
  basic_000020: 'Edit',
  basic_000021: 'are you sure you want to delete?Prompt: it cannot be recovered after deletion',
  basic_000022: 'payee name',
  basic_000023: 'bank account name',
  basic_000024: 'bank code',
  basic_000025: 'bank name',
  basic_000026: 'bank account number',
  basic_000027: 'sort',
  basic_000028: 'new',
  basic_000029: 'Refresh',
  basic_000030: 'enter code or name keyword query',
  basic_000031: 'code',
  basic_000032: 'name',
  basic_000033: 'bank type',
  basic_000034: 'save',
  basic_000035: 'payee type',
  basic_000036: 'payee ID',
  basic_000037: 'payee code',
  basic_000038: 'please enter the payee name',
  basic_000039: 'please enter the bank account name',
  basic_000040: 'bank ID',
  basic_000041: 'bank',
  basic_000042: 'please enter bank',
  basic_000043: 'bank account number',
  basic_000044: 'please enter the bank account number',
  basic_000045: 'please enter sorting',
  basic_000046: 'interval (hours)',
  basic_000047: 'please fill in the interval (hours)!',
  basic_000048: 'quantity of work to be done (PCs.)',
  basic_000049: 'quantity of work to be done (PCs.)!',
  basic_000050: 'last reminder time',
  basic_000051: 'update',
  basic_000052: 'only PNG files can be uploaded!',
  basic_000053: 'the picture size should be less than 10KB!',
  basic_000054: 'my head',
  basic_000055: 'upload Avatar',
  basic_000056: 'the picture is in PNG format and the size is within 10KB',
  basic_000057: 'name',
  basic_000058: 'user type',
  basic_000059: 'employee number',
  basic_000060: 'gender',
  basic_000061: 'male',
  basic_000062: 'female',
  basic_000063: 'ID numbe',
  basic_000064: 'mailbox',
  basic_000065: 'mobile phone',
  basic_000066: 'language code',
  basic_000067: 'simplified Chinese',
  basic_000068: 'bookkeeping user',
  basic_000069: 'update information',
  basic_000070: 'update password',
  basic_000071: 'account number',
  basic_000072: 'account number cannot be empty',
  basic_000073: 'old password',
  basic_000074: 'please fill in the old password!',
  basic_000075: 'name cannot be empty',
  basic_000076: 'unbind?',
  basic_000077: 'yes',
  basic_000078: 'no',
  basic_000079: 'unbinding',
  basic_000080: 'binding',
  basic_000081: 'stow',
  basic_000082: 'platform account',
  basic_000083: 'bound',
  basic_000084: 'master account',
  basic_000085: 'binding mobile phone',
  basic_000086: 'unbound',
  basic_000087: 'bind mailbox',
  basic_000088: 'binding enterprise wechat',
  basic_000089: 'binding pin',
  basic_000090: 'bind mobile number',
  basic_000091: 'binding account',
  basic_000092: 'the mailbox format is incorrect',
  basic_000093: 'wrong mobile phone format',
  basic_000094: 'mailbox cannot be empty',
  basic_000095: 'enterprise micro signal cannot be empty',
  basic_000096: 'pin number cannot be empty',
  basic_000097: 'mobile number cannot be empty',
  basic_000098: 'type',
  basic_000099: 'verification code',
  basic_000100: 'verification code cannot be empty',
  basic_000101: 'send verification code',
  basic_000102: 'bind now',
  basic_000103: 'public role',
  basic_000104: 'role group',
  basic_000105: 'role source',
  basic_000106: 'my functional role',
  basic_000107: 'select the corresponding role item display permission',
  basic_000108: 'Application module',
  basic_000109: 'page',
  basic_000110: 'function item',
  basic_000111: 'no data temporarily',
  basic_000112: 'enter name keyword query',
  basic_000113: 'my data role',
  basic_000114: 'configured data permissions',
  basic_000115: 'total {total}',
  basic_000117: 'tree structure',
  basic_000118: 'you can enter the name or application module keyword to query',
  basic_000119: 'Data permission type',
  basic_000120: 'view data permission',
  basic_000121: 'saved successfully',
  basic_000122: 'deletion succeeded',
  basic_000123: 'frozen',
  basic_000124: 'supplier code',
  basic_000125: 'supplier name',
  basic_000126: 'configuring function roles',
  basic_000127: 'configuring data roles',
  basic_000128: 'please select the function role to add',
  basic_000129: 'configured function roles',
  basic_000130: 'add function role',
  basic_000131: 'Cancel',
  basic_000132: 'are you sure you want to remove the selected role?',
  basic_000133: 'batch removal',
  basic_000134: 'selected',
  basic_000135: 'are you sure you want to remove?',
  basic_000136: 'selectable roles',
  basic_000137: 'please select the data role to add',
  basic_000138: 'configured data roles',
  basic_000139: 'add data role',
  basic_000140: 'frozen',
  basic_000141: 'password reset succeeded',
  basic_000142: 'copy succeeded',
  basic_000143: 'you can select the left node to obtain relevant operations',
  basic_000144: 'employee name',
  basic_000145: 'please enter employee number or name to query',
  basic_000146: 'employee list',
  basic_000147: 'reset password',
  basic_000148: 'employee number cannot be empty',
  basic_000149: 'it is allowed to enter letters and numbers, and no more than 20 characters!',
  basic_000150: 'employee name cannot be empty',
  basic_000151: 'position configuration',
  basic_000152: 'copy permissions to users',
  basic_000153: 'please select a role and try again',
  basic_000154: 'please select the target user and try again',
  basic_000155: 'previous',
  basic_000156: 'done',
  basic_000157: 'next',
  basic_000158: 'copy permission',
  basic_000159: 'select role',
  basic_000160: 'select the function role and data role to copy',
  basic_000161: 'select user',
  basic_000162: 'select the user you want to copy the role to',
  basic_000163: 'save selected results',
  basic_000164: 'enter code or name keyword query',
  basic_000165: 'function role',
  basic_000166: 'enter code or name keyword',
  basic_000167: 'data role',
  basic_000168: 'selected function role',
  basic_000169: 'selected data role',
  basic_000170: 'selected user',
  basic_000171: 'please select the position to add',
  basic_000172: 'configured position',
  basic_000173: 'add position',
  basic_000174: 'are you sure you want to remove the selected user?',
  basic_000175: 'optional position',
  basic_000176: 'professional field',
  basic_000177: 'please select the tree node on the left to operate',
  basic_000178: 'please select the parent node!',
  basic_000179: 'the root node cannot be moved!',
  basic_000180: 'please select the node to move!',
  basic_000181: 'please select the parent node to move to!',
  basic_000182: 'please select the node to delete!',
  basic_000183: 'newly added root node',
  basic_000184: 'create node',
  basic_000185: 'move',
  basic_000186: 'delete',
  basic_000187: 'new child node',
  basic_000188: 'move node [{node}] to',
  basic_000190: 'new',
  basic_000191: 'parent node',
  basic_000192: 'code cannot be empty',
  basic_000193: 'serial number cannot be empty',
  basic_000194: 'OK',
  basic_000195: 'position category code cannot exceed 6 characters',
  basic_000196: 'are you sure you want to delete?',
  basic_000197: 'please enter code or name keyword query',
  basic_000198: 'position list',
  basic_000199: 'position category cannot be empty',
  basic_000200: 'configure user',
  basic_000201: 'copy position',
  basic_000202: 'copy position to specified organization',
  basic_000203: 'source position ID',
  basic_000204: 'source position',
  basic_000205: 'target organization ID',
  basic_000206: 'target organization',
  basic_000207: 'target organization cannot be empty',
  basic_000208: 'copy function role',
  basic_000209: 'please select the user to add',
  basic_000210: 'configured users',
  basic_000211: 'add user',
  basic_000212: 'selectable users',
  basic_000213: 'move succeeded',
  basic_000214: 'move node [{node}] to',
  basic_000215: 'create a new child organization',
  basic_000216: 'are you sure you want to delete?',
  basic_000217: 'prompt: cannot restore after deletion',
  basic_000218: 'are you sure you want to return?',
  basic_000219: 'prompt: unsaved data will be lost',
  basic_000220: 'return',
  basic_000221: 'auto create',
  basic_000222: 'abbreviation',
  basic_000223: 'reference code',
  basic_000224: 'serial number',
  basic_000225: 'budget company',
  basic_000226: 'ERP company code',
  basic_000227: 'functional currency currency code',
  basic_000228: 'name of functional currency',
  basic_000229: 'default trading partner code',
  basic_000230: 'trading partner of related party transactions',
  basic_000231: 'internal supplier code',
  basic_000232: 'wechat user credentials',
  basic_000233: 'wechat user certificate key',
  basic_000234: 'ERP company code cannot be empty',
  basic_000235: 'organization ID',
  basic_000236: 'functional currency currency code cannot be empty',
  basic_000237: 'the name of functional currency currency cannot be empty',
  basic_000238: 'internal supplier code cannot exceed 20 characters',
  basic_000239: '- user login',
  basic_000240: 'please enter the tenant account',
  basic_000241: 'tenant account',
  basic_000242: 'please enter user name',
  basic_000243: 'user name',
  basic_000244: 'please enter the password!',
  basic_000245: 'password',
  basic_000246: 'please enter the verification code!',
  basic_000247: 'login',
  basic_000248: 'background configuration',
  basic_000249: 'application menu',
  basic_000250: 'permission object',
  basic_000251: 'tenant management',
  basic_000252: 'permission management',
  basic_000253: 'Data permission display',
  basic_000254: 'application routing list',
  basic_000255: 'organization saved successfully',
  basic_000256: 'allocation succeeded',
  basic_000257: 'removal succeeded',
  basic_000258: 'tenant list',
  basic_000259: 'configuration',
  basic_000260: 'select the tenant on the left to configure relevant elements',
  basic_000261: 'unassigned Application module',
  basic_000262: 'select all',
  basic_000263: 'Edit tenant',
  basic_000264: 'new tenant',
  basic_000265: 'tenant code cannot be modified once created',
  basic_000266: 'tenant code',
  basic_000267: 'tenant name',
  basic_000268: 'organization cannot be empty',
  basic_000269: 'tenant',
  basic_000270: 'tenant [{tenant}] watermark',
  basic_000272: 'tenant [{tenant}] icon',
  basic_000273: 'tenant [{tenant}] process engine code',
  basic_000274: 'watermark design',
  basic_000275: 'watermark preview',
  basic_000276: 'copy',
  basic_000277: 'copy cannot be empty',
  basic_000278: 'font size',
  basic_000279: 'font size cannot be empty',
  basic_000280: 'rotation angle',
  basic_000281: 'rotation angle cannot be empty',
  basic_000282: 'width',
  basic_000283: 'width cannot be empty',
  basic_000284: 'height',
  basic_000285: 'height cannot be empty',
  basic_000286: 'color',
  basic_000287: 'color cannot be empty',
  basic_000288: 'user name copy',
  basic_000289: 'disabled',
  basic_000290: 'Preview',
  basic_000291: 'no watermark',
  basic_000292: 'do not spread',
  basic_000293: 'menu logo',
  basic_000294: 'shrink logo',
  basic_000295: 'please upload 40',
  basic_000296: '40px or integer multiple, background transparent SVG format picture',
  basic_000297: 'shrink icon cannot be empty',
  basic_000298: 'expand logo',
  basic_000299: 'please upload 200',
  basic_000300: 'expansion icon cannot be empty',
  basic_000301: 'no menu logo',
  basic_000302: 'content',
  basic_000303: 'select process engine code',
  basic_000304: 'process engine code',
  basic_000305: 'engine code cannot be empty',
  basic_000306: 'remove Application module',
  basic_000307: 'are you sure you want to remove?',
  basic_000308: 'description',
  basic_000309: 'assign Application module',
  basic_000310: 'are you sure you want to remove the selected item?',
  basic_000311: 'available application modules',
  basic_000312: 'Edit tenant administrator',
  basic_000313: 'new tenant administrator',
  basic_000314: 'user name',
  basic_000315: 'user name cannot be empty',
  basic_000316: 'email',
  basic_000317: 'email address cannot be empty',
  basic_000318: 'mobile number',
  basic_000319: 'Administrator',
  basic_000320: 'set administrator',
  basic_000321: 'enter code, name and Application module keyword query',
  basic_000322: 'function group',
  basic_000323: 'you can select the list item on the left for corresponding operation',
  basic_000324: 'modify menu item',
  basic_000325: 'new menu item',
  basic_000326: 'rule',
  basic_000327: 'the first letter of each Chinese character in the name is capitalized',
  basic_000328: 'page routing address',
  basic_000329: 'page routing address cannot be empty',
  basic_000330: 'tenant available',
  basic_000331: 'page function item',
  basic_000332: 'page function management',
  basic_000333: 'function code',
  basic_000334: 'function path',
  basic_000335: 'function item list',
  basic_000336: 'modify function item',
  basic_000337: 'new function item',
  basic_000338: 'edit function item group',
  basic_000339: 'new function item group',
  basic_000340: 'please select an application module',
  basic_000341: 'permission object type',
  basic_000342: 'function code',
  basic_000343: 'modify data permission type',
  basic_000344: 'new data permission type',
  basic_000345: 'permission object type cannot be empty',
  basic_000346: 'function code cannot exceed 50 characters',
  basic_000347: 'entity class name',
  basic_000348: 'API service path',
  basic_000349: 'modify permission object',
  basic_000350: 'new permission object',
  basic_000351: 'entity class name cannot be empty',
  basic_000352: 'API service path cannot be empty',
  basic_000353: 'service name',
  basic_000354: 'web base address',
  basic_000355: 'modify application module',
  basic_000356: 'new application module',
  basic_000357: 'service name cannot be empty',
  basic_000358: 'menu moved successfully',
  basic_000359: 'new application',
  basic_000360: 'you can select the left menu node to obtain relevant operations',
  basic_000361: 'the icon of the application cannot be empty',
  basic_000362: 'new submenu',
  basic_000363: 'application icon',
  basic_000364: 'upload icon',
  basic_000365:
    'please upload the icon for the application, the picture is in PNG format, the length and width of the picture are 44px, and the size is within 10KB',
  basic_000366: 'application name',
  basic_000367: 'application name cannot be empty',
  basic_000368: 'menu name',
  basic_000369: 'menu name cannot be empty',
  basic_000370: 'icon class name',
  basic_000371: 'icon class name cannot be empty',
  basic_000372: 'menu item',
  basic_000373: 'menu item cannot be empty',
  basic_000374: 'move the menu [{menu}] to',
  basic_000376: 'function permission configuration process Wizard',
  basic_000377: 'Edit role group',
  basic_000378: 'new role group',
  basic_000379: 'role list',
  basic_000380: 'select role list item for function item configuration',
  basic_000381: 'assign function item',
  basic_000382: 'enter name keyword',
  basic_000383: 'function role distribution',
  basic_000384: 'view role distribution',
  basic_000385: 'modify role',
  basic_000386: 'new role',
  basic_000387: 'role type',
  basic_000388: 'user type cannot be empty',
  basic_000389: 'view position',
  basic_000390: 'viewing users',
  basic_000391: 'are you sure you want to remove the function item?',
  basic_000392: 'I want to assign function items',
  basic_000393: 'enter user code or name keyword query',
  basic_000394: 'are you sure you want to remove the selected position?',
  basic_000395: 'please enter user account',
  basic_000396: "user's function role list",
  basic_000397: 'Data permission configuration process Wizard',
  basic_000398: 'select role item for permission configuration',
  basic_000399: 'configure permissions',
  basic_000400: 'all application modules',
  basic_000401: 'please select the data permission to add',
  basic_000402: 'Add Data permission',
  basic_000403: "user's data role list",
  basic_000404: 'SEI basic application',
  basic_000405: 'element',
  basic_000406: 'The operation was successful',
  basic_000407: 'Are you sure you want to force 【{userName}】 to quit？',
  basic_000408: 'Account Binding',
  basic_000409: 'Account copy',
  basic_000410: 'TaxNo',
  basic_000411: 'Associated organization',
  basic_000412: 'cannot exceed 6 characters',
};
