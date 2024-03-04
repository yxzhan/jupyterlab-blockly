import * as Blockly from 'blockly';
import { pythonGenerator as BlocklyPy } from 'blockly/python';

BlocklyPy.INDENT  = '    ';

const giskard_colors = [
  "#FF5733", // Orange
  "#34A853", // Green
  "#4285F4", // Blue
  "#DB4437", // Red
  "#F7B733", // Yellow
  "#7B1FA2", // Purple
  "#FFA500", // Orange
  "#00796B", // Teal
  "#9C27B0", // Deep Purple
  "#2196F3"  // Indigo
];
/*
 * Block definitions
 */

const GISKARD_BLOCKS = [
  {
    // unique id of a type of block
    id: 'import_libs',
    // Function defines how the block will look like, the inputs, the fields, etc.
    // Docs: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#javascript_2
    block_init: function() {
      this.appendDummyInput()
        .appendField('Import libraries')
      this.setPreviousStatement(false, null)
      this.setNextStatement(true, null)
      this.setColour(giskard_colors[5])
      this.setTooltip('Import python libraries.')
      this.setHelpUrl('')
    },
    // The python code generator for the block
    generator: (block) => {
      let code = '\n'
      return code
    },
    // The python top-level code, for example import libraries
    toplevel_init: [
      `import rospy`,
      `from geometry_msgs.msg import PoseStamped, Point, Quaternion, Vector3Stamped, PointStamped, QuaternionStamped`,
      `import utils`,
      `from utils import launch_robot, move_robot, get_controlled_joints, get_links, add_joint_position, add_cartesian_pose, cmd_vel_move, cmd_vel_turn`,
    ].join('\n') + '\n\n'
  },
  {
    // unique id of a type of block
    id: 'giskard_start',
    // Function defines how the block will look like, the inputs, the fields, etc.
    // Docs: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#javascript_2
    block_init: function() {
      this.appendValueInput('ROBOT')
        .setCheck('String')
        .appendField('Start robot')
      this.appendValueInput('ENV')
        .setCheck('String')
        .appendField('in')
      this.appendValueInput('RESTART')
        .setCheck('Boolean')
        .appendField(', and always restart:')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setInputsInline(true)
      this.setColour(giskard_colors[0])
      this.setTooltip('Start a robot simulator.')
      this.setHelpUrl('')
    },
    // The python code generator for the block
    generator: (block) => {
      let value_robot = BlocklyPy.valueToCode(block, 'ROBOT', BlocklyPy.ORDER_ATOMIC);
      let value_env = BlocklyPy.valueToCode(block, 'ENV', BlocklyPy.ORDER_ATOMIC);
      let value_reset = BlocklyPy.valueToCode(block, 'RESTART', BlocklyPy.ORDER_ATOMIC);
      let code = `launch_robot(${value_robot}, sim_env=${value_env}, restart=${value_reset})`
      return code + '\n';
    },
  },
  {
    id: 'giskard_sleep',
    block_init: function() {
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('Wait for');
      this.appendDummyInput()
        .appendField('seconds');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setInputsInline(true);
      this.setColour(giskard_colors[1])
      this.setTooltip('Wait for a certain amount of time.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `rospy.sleep(${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_forward',
    block_init: function() {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Move forward with speed');
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('m/s for');
      this.appendDummyInput()
        .appendField('seconds.');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[3])
      this.setTooltip(
        'Move forward with a certain speed for a chosen no. of seconds.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_speed = BlocklyPy.valueToCode(block, 'SPEED', BlocklyPy.ORDER_ATOMIC);
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `cmd_vel_move(${value_speed}, ${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_backward',
    block_init: function() {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Move backward with speed');
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('m/s for');
      this.appendDummyInput()
        .appendField('seconds.');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[3])
      this.setTooltip(
        'Move backward with a certain speed for a chosen no. of seconds.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_speed = BlocklyPy.valueToCode(block, 'SPEED', BlocklyPy.ORDER_ATOMIC);
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `cmd_vel_move(-${value_speed}, ${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_turn_left',
    block_init: function() {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Turn left with speed');
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('for');
      this.appendDummyInput().appendField('seconds');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[4])
      this.setTooltip(
        'Turn left with a certain speed for a chosen no. of seconds.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_speed = BlocklyPy.valueToCode(block, 'SPEED', BlocklyPy.ORDER_ATOMIC);
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `cmd_vel_turn(${value_speed}, ${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_turn_right',
    block_init: function() {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Turn right with speed');
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('for');
      this.appendDummyInput().appendField('seconds');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[4])
      this.setTooltip(
        'Turn right with a certain speed for a chosen no. of seconds.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_speed = BlocklyPy.valueToCode(block, 'SPEED', BlocklyPy.ORDER_ATOMIC);
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `cmd_vel_turn(-${value_speed}, ${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_moveto',
    block_init: function() {
      this.appendValueInput('POSITION')
        .setCheck('Point')
        .appendField('Move robot to');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[2])
      this.setTooltip(
        'Move robot to postion (X, Y, Z).'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_pos = BlocklyPy.valueToCode(block, 'POSITION', BlocklyPy.ORDER_ATOMIC);
      let code = `move_robot(${value_pos})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_motion_goals_add_cartesian_pose',
    block_init: function() {
      
      this.appendValueInput('TIP_LINK')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('Cartesian pose motion goal with: tip_link');
      this.appendValueInput('ROOT_LINK')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('root_link');
      this.appendValueInput('POSITION')
        .setCheck('Point')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('position');
      this.appendValueInput('ORIENTATION')
        .setCheck('Quaternion')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('orientation');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setInputsInline(false);
      this.setColour(giskard_colors[2])
      this.setTooltip(
        'Giskard api: giskard_wrapper.motion_goals.add_cartesian_position'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_tip_link = BlocklyPy.valueToCode(block, 'TIP_LINK', BlocklyPy.ORDER_ATOMIC) || "'base_link'";
      let value_root_link = BlocklyPy.valueToCode(block, 'ROOT_LINK', BlocklyPy.ORDER_ATOMIC) || "'map'";
      let value_pos = BlocklyPy.valueToCode(block, 'POSITION', BlocklyPy.ORDER_ATOMIC) || 'None';
      let value_ori = BlocklyPy.valueToCode(block, 'ORIENTATION', BlocklyPy.ORDER_ATOMIC) || 'None';
      let code = `add_cartesian_pose(${value_pos}, ${value_ori}, root_link=${value_root_link}, tip_link=${value_tip_link})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_motion_goals_add_joint_position',
    block_init: function() {
      this.appendValueInput('JOINT_LIST')
        .setCheck('Array')
        .appendField('Set joint position');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[2])
      this.setTooltip(
        'Giskard api: giskard_wrapper.motion_goals.add_joint_position'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_side = BlocklyPy.valueToCode(block, 'JOINT_LIST', BlocklyPy.ORDER_ATOMIC);
      let code = "add_joint_position(" + value_side + ")";
      return code + '\n';
    }
  },
  {
    id: 'giskard_joint_state',
    block_init: function() {
      this.appendValueInput("JOINT_NAME")
          .setCheck("String")
          .appendField("Joint");
      this.appendValueInput("POSITION")
          .setCheck("Number")
          .appendField("to ");
      this.setInputsInline(true);
      this.setOutput(true, "Dict");
      this.setColour(giskard_colors[4])
      this.setTooltip("Joint state.");
      this.setHelpUrl("");
    },
    generator: (block) => {
      let value_joint = BlocklyPy.valueToCode(block, 'JOINT_NAME', BlocklyPy.ORDER_ATOMIC) || '';
      let value_pos = BlocklyPy.valueToCode(block, 'POSITION', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `{${value_joint}: ${value_pos}}`;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'giskard_joint_trajectory_controller',
    block_init: function() {
      this.appendDummyInput('')
        .appendField('Display joint trajectory controller');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[7])
      this.setTooltip(
        'Display joint_trajectory_controller'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let code = "utils.display_joint_trajectory_controller()";
      return code + '\n';
    }
  },
  {
    id: 'giskard_get_controlled_joints',
    block_init: function() {
      this.appendDummyInput()
        .appendField('Robot controlled joints');
      this.setColour(giskard_colors[3])
      this.setOutput(true, 'List');
      this.setTooltip(
        'Get robot controlled joints.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let code = "get_controlled_joints()";
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'giskard_get_links',
    block_init: function() {
      this.appendDummyInput()
        .appendField('Robot links');
      this.setColour(giskard_colors[3])
      this.setOutput(true, 'List');
      this.setTooltip(
        'Get robot links.'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let code = "get_links()";
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'geometry_msgs_point',
    block_init: function() {
      this.appendValueInput('X')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('Point x')
      this.appendValueInput('Y')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('y');
      this.appendValueInput('Z')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('z');
      this.setOutput(true, 'Point');
      this.setColour(giskard_colors[4])
      this.setTooltip('Geometric primitive point.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_x = BlocklyPy.valueToCode(block, 'X', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_y = BlocklyPy.valueToCode(block, 'Y', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_z = BlocklyPy.valueToCode(block, 'Z', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `Point(${value_x}, ${value_y}, ${value_z})`;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },  
  {
    id: 'geometry_msgs_quaternion',
    block_init: function() {
      this.appendValueInput('X')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('Quaternion x')
      this.appendValueInput('Y')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('y');
      this.appendValueInput('Z')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('z');
      this.appendValueInput('W')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('w');
      this.setOutput(true, 'Quaternion');
      this.setColour(giskard_colors[4])
      this.setTooltip('Geometric primitive Quaternion.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_x = BlocklyPy.valueToCode(block, 'X', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_y = BlocklyPy.valueToCode(block, 'Y', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_z = BlocklyPy.valueToCode(block, 'Z', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_w = BlocklyPy.valueToCode(block, 'W', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `Quaternion(${value_x}, ${value_y}, ${value_z}, ${value_w})`;
      // return code;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'arbitrary_code',
    block_init: function() {
      this.appendDummyInput()
        .appendField("Arbitrary python code")
        .appendField(new Blockly.FieldMultilineInput('# ========= Embed code ========= # \n\n\n\n\n# ========= End ========= #'),
            'PYTHON_CODE');
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(giskard_colors[8])
      this.setTooltip('Embed arbitrary python code, for testing.')
    },
    generator: (block) => {
      let code = block.getFieldValue('PYTHON_CODE')
      return code + '\n';
    }
  }
]

// Registering the custom blocks and their generators in blockly
for (const blocks of GISKARD_BLOCKS) {
  Blockly.Blocks[blocks.id] = {
    init: blocks.block_init
  };

  BlocklyPy[blocks.id] = blocks.generator;
  if (blocks.toplevel_init) {
    Blockly.Blocks[blocks.id].toplevel_init = blocks.toplevel_init;
  }
}

// Creating a toolbox extends the base blocks toolbox by adding the custom blocks
export default {
  kind: 'CATEGORY',
  colour: giskard_colors[0],
  name: 'Robotics',
  contents: GISKARD_BLOCKS.map(v => {
    return {
      kind: 'BLOCK',
      type: v.id
    }
  })
}
