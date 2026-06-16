#!/usr/bin/env python3
"""
ZestC Bootstrap Compiler — Phase 0
The first compiler for a language where the primitive is a wave, not a bit.

Usage:
    python3 zestc.py run  <file.zc>    # interpret (immediate execution)
    python3 zestc.py emit <file.zc>    # emit LLVM IR for AMDGPU

The compiler has three stages:
    1. Lexer:  .zc source → tokens
    2. Parser: tokens → Wave IR (septit topology, not AST)
    3. Executor: Wave IR → physics (interpreter or LLVM codegen)
"""

import sys
import os
import re
import math
import struct
from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Optional, Any
from enum import Enum, auto


# ══════════════════════════════════════════════════════════════
# THE SEPTIT — The only type in ZestC
# Not a struct. Not a container. The irreducible wave unit.
# 7 properties. 7 states. 21 pairwise interactions.
# ══════════════════════════════════════════════════════════════

@dataclass
class Septit:
    """The primitive. Everything is this. Nothing else exists."""
    name: str
    # The 7 properties — irreducible
    energy: float = 0.0
    phase: float = 0.0
    spin: float = 0.0
    charge: float = 0.0
    coherence: float = 1.0   # starts quantum (full superposition)
    coupling: float = 0.0
    observer: float = 0.0
    # Derived state
    well_depth: float = 1.0
    crystallization: float = 0.0
    septit_level: int = 1     # 1-7, never 0

    def quantize(self):
        """Collapse energy to septit level. Never zero. Absence is 1."""
        e = self.energy
        if   e >= 2.00: self.septit_level = 7
        elif e >= 1.00: self.septit_level = 6
        elif e >= 0.75: self.septit_level = 5
        elif e >= 0.50: self.septit_level = 4
        elif e >= 0.30: self.septit_level = 3
        elif e >= 0.15: self.septit_level = 2
        else:           self.septit_level = 1

    def observe(self) -> dict:
        """Read the state. THIS COSTS COHERENCE. The act of knowing changes what is known."""
        self.coherence *= 0.995  # every observation decoheres
        self.observer = min(1.0, self.observer + 0.01)  # observer grows
        return {
            'name': self.name,
            'energy': self.energy,
            'phase': self.phase,
            'spin': self.spin,
            'charge': self.charge,
            'coherence': self.coherence,
            'coupling': self.coupling,
            'observer': self.observer,
            'well_depth': self.well_depth,
            'crystallization': self.crystallization,
            'septit_level': self.septit_level,
        }


@dataclass
class Coupling:
    """Entanglement between two septits. Not a pointer. A relationship."""
    from_name: str
    to_name: str
    strength: float = 1.0


@dataclass
class Sea:
    """A collection of septits that interact. The memory landscape."""
    name: str
    capacity: int = 100000
    device: str = "gpu"
    septits: Dict[str, Septit] = field(default_factory=dict)
    couplings: List[Coupling] = field(default_factory=list)

    def get_neighbors(self, name: str) -> List[Tuple[str, float]]:
        """Get all entangled neighbors and their coupling strengths."""
        neighbors = []
        for c in self.couplings:
            if c.from_name == name:
                neighbors.append((c.to_name, c.strength))
            elif c.to_name == name:
                neighbors.append((c.from_name, c.strength))
        return neighbors


# ══════════════════════════════════════════════════════════════
# TOKEN TYPES
# ══════════════════════════════════════════════════════════════

class TT(Enum):
    # Verbs — the instruction set of ZestC
    ABSORB = auto()
    MANIFEST = auto()
    COUPLE = auto()
    PULSE = auto()
    CRYSTALLIZE = auto()
    EMIT = auto()
    FUSE = auto()
    OBSERVE = auto()
    SHATTER = auto()
    SEAL = auto()
    BIND = auto()
    GROW = auto()
    FILTER = auto()
    REJECT = auto()
    DEFEND = auto()
    SEED = auto()
    STRETCH = auto()
    POOL = auto()
    BLEED = auto()
    COMMIT = auto()
    CALCIFY = auto()
    TRANSMUTE = auto()
    IGNITE = auto()
    TUNNEL = auto()
    # Structure
    SEA = auto()
    HEARTBEAT = auto()
    SLASH_SEVEN = auto()  # /7
    WITH = auto()
    FROM = auto()
    NERVE = auto()
    GOLDEN_EQUATION = auto()
    SYNCHRONIZER = auto()
    KERNEL = auto()
    EVERY = auto()
    WITHIN = auto()
    NONE_KW = auto()
    SCHEDULE = auto()
    TUNNEL_MAP = auto()
    BINDING_CHECK = auto()
    BYPASS_THALAMUS = auto()
    # Literals
    IDENT = auto()
    NUMBER = auto()
    STRING = auto()
    # Punctuation
    LBRACE = auto()
    RBRACE = auto()
    LBRACKET = auto()
    RBRACKET = auto()
    COLON = auto()
    ARROW = auto()      # →  or ->
    DOT = auto()
    COMMA = auto()
    # Control
    EOF = auto()
    NEWLINE = auto()


@dataclass
class Token:
    type: TT
    value: Any
    line: int
    col: int


# ══════════════════════════════════════════════════════════════
# LEXER — Tokenize .zc source
# ══════════════════════════════════════════════════════════════

KEYWORDS = {
    'absorb': TT.ABSORB, 'manifest': TT.MANIFEST, 'couple': TT.COUPLE,
    'pulse': TT.PULSE, 'crystallize': TT.CRYSTALLIZE, 'emit': TT.EMIT,
    'fuse': TT.FUSE, 'observe': TT.OBSERVE, 'shatter': TT.SHATTER,
    'seal': TT.SEAL, 'bind': TT.BIND, 'grow': TT.GROW,
    'filter': TT.FILTER, 'reject': TT.REJECT, 'defend': TT.DEFEND,
    'seed': TT.SEED, 'stretch': TT.STRETCH, 'pool': TT.POOL,
    'bleed': TT.BLEED, 'commit': TT.COMMIT, 'calcify': TT.CALCIFY,
    'transmute': TT.TRANSMUTE, 'ignite': TT.IGNITE, 'tunnel': TT.TUNNEL,
    'sea': TT.SEA, 'heartbeat': TT.HEARTBEAT,
    'with': TT.WITH, 'from': TT.FROM,
    'nerve': TT.NERVE, 'golden_equation': TT.GOLDEN_EQUATION,
    'synchronizer': TT.SYNCHRONIZER, 'kernel': TT.KERNEL,
    'every': TT.EVERY, 'within': TT.WITHIN, 'none': TT.NONE_KW,
    'schedule': TT.SCHEDULE, 'tunnel_map': TT.TUNNEL_MAP,
    'binding_check': TT.BINDING_CHECK, 'bypass_thalamus': TT.BYPASS_THALAMUS,
}

def lex(source: str, filename: str = "<stdin>") -> List[Token]:
    """Tokenize ZestC source into a stream of tokens."""
    tokens = []
    lines = source.split('\n')

    for line_no, line in enumerate(lines, 1):
        col = 0
        while col < len(line):
            ch = line[col]

            # Skip whitespace (not newlines — those are structural)
            if ch in ' \t':
                col += 1
                continue

            # Comments: // to end of line
            if ch == '/' and col + 1 < len(line) and line[col + 1] == '/':
                break  # rest of line is comment

            # /7 — the recursion constant
            if ch == '/' and col + 1 < len(line) and line[col + 1] == '7':
                tokens.append(Token(TT.SLASH_SEVEN, '/7', line_no, col))
                col += 2
                continue

            # Arrow: → or ->
            if ch == '→':
                tokens.append(Token(TT.ARROW, '→', line_no, col))
                col += len('→'.encode('utf-8'))  # skip the multi-byte char
                # Actually just advance by 1 since we're iterating chars
                col += 1
                continue
            if ch == '-' and col + 1 < len(line) and line[col + 1] == '>':
                tokens.append(Token(TT.ARROW, '->', line_no, col))
                col += 2
                continue

            # Punctuation
            if ch == '{':
                tokens.append(Token(TT.LBRACE, '{', line_no, col))
                col += 1; continue
            if ch == '}':
                tokens.append(Token(TT.RBRACE, '}', line_no, col))
                col += 1; continue
            if ch == '[':
                tokens.append(Token(TT.LBRACKET, '[', line_no, col))
                col += 1; continue
            if ch == ']':
                tokens.append(Token(TT.RBRACKET, ']', line_no, col))
                col += 1; continue
            if ch == ':':
                tokens.append(Token(TT.COLON, ':', line_no, col))
                col += 1; continue
            if ch == '.':
                tokens.append(Token(TT.DOT, '.', line_no, col))
                col += 1; continue
            if ch == ',':
                tokens.append(Token(TT.COMMA, ',', line_no, col))
                col += 1; continue

            # String literal: "..."
            if ch == '"':
                end = line.find('"', col + 1)
                if end == -1:
                    print(f"[ZestC] ERROR {filename}:{line_no}:{col}: unterminated string")
                    sys.exit(1)
                tokens.append(Token(TT.STRING, line[col+1:end], line_no, col))
                col = end + 1
                continue

            # Number: integer or float (including negative)
            if ch.isdigit() or (ch == '-' and col + 1 < len(line) and line[col+1].isdigit()):
                match = re.match(r'-?\d+\.?\d*(?:[eE][+-]?\d+)?', line[col:])
                if match:
                    val_str = match.group(0)
                    val = float(val_str) if '.' in val_str or 'e' in val_str.lower() else int(val_str)
                    tokens.append(Token(TT.NUMBER, val, line_no, col))
                    col += len(val_str)
                    continue

            # Identifier or keyword
            if ch.isalpha() or ch == '_':
                match = re.match(r'[a-zA-Z_][a-zA-Z0-9_]*', line[col:])
                if match:
                    word = match.group(0)
                    tt = KEYWORDS.get(word, TT.IDENT)
                    tokens.append(Token(tt, word, line_no, col))
                    col += len(word)
                    continue

            # Unknown character — skip it
            col += 1

        tokens.append(Token(TT.NEWLINE, '\n', line_no, len(line)))

    tokens.append(Token(TT.EOF, None, len(lines), 0))
    return tokens


# ══════════════════════════════════════════════════════════════
# WAVE IR — The topology representation
# Not AST. Not SSA. A wave topology.
# ══════════════════════════════════════════════════════════════

class IRNodeType(Enum):
    SEA_DECL = auto()
    MANIFEST = auto()
    COUPLE = auto()
    ABSORB = auto()
    PULSE = auto()
    CRYSTALLIZE = auto()
    EMIT = auto()
    HEARTBEAT = auto()
    SLASH_SEVEN = auto()
    FUSE = auto()
    NERVE_DECL = auto()
    GOLDEN_EQUATION = auto()
    SYNCHRONIZER = auto()
    KERNEL_DECL = auto()
    TUNNEL = auto()
    BIND = auto()
    BLEED = auto()
    OBSERVE = auto()

@dataclass
class IRNode:
    type: IRNodeType
    data: Dict[str, Any] = field(default_factory=dict)
    children: List['IRNode'] = field(default_factory=list)


# ══════════════════════════════════════════════════════════════
# PARSER — Build Wave IR from tokens
# ══════════════════════════════════════════════════════════════

class Parser:
    def __init__(self, tokens: List[Token], filename: str = "<stdin>"):
        self.tokens = [t for t in tokens if t.type != TT.NEWLINE]  # strip newlines
        self.pos = 0
        self.filename = filename

    def peek(self) -> Token:
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return Token(TT.EOF, None, 0, 0)

    def advance(self) -> Token:
        tok = self.peek()
        self.pos += 1
        return tok

    def expect(self, tt: TT) -> Token:
        tok = self.advance()
        if tok.type != tt:
            self.error(f"expected {tt.name}, got {tok.type.name} '{tok.value}'", tok)
        return tok

    def error(self, msg: str, tok: Token = None):
        if tok is None: tok = self.peek()
        print(f"[ZestC] PARSE ERROR {self.filename}:{tok.line}:{tok.col}: {msg}")
        sys.exit(1)

    def parse(self) -> List[IRNode]:
        """Parse the entire .zc file into a list of IR nodes."""
        nodes = []
        while self.peek().type != TT.EOF:
            node = self.parse_statement()
            if node:
                nodes.append(node)
        return nodes

    def parse_statement(self) -> Optional[IRNode]:
        tok = self.peek()

        if tok.type == TT.SEA:
            return self.parse_sea_decl()
        elif tok.type == TT.ABSORB:
            return self.parse_absorb()
        elif tok.type == TT.MANIFEST:
            return self.parse_manifest()
        elif tok.type == TT.COUPLE:
            return self.parse_couple()
        elif tok.type == TT.PULSE:
            return self.parse_pulse()
        elif tok.type == TT.CRYSTALLIZE:
            return self.parse_crystallize()
        elif tok.type == TT.EMIT:
            return self.parse_emit()
        elif tok.type == TT.HEARTBEAT:
            return self.parse_heartbeat()
        elif tok.type == TT.FUSE:
            return self.parse_fuse()
        elif tok.type == TT.NERVE:
            return self.parse_nerve_decl()
        elif tok.type == TT.GOLDEN_EQUATION:
            return self.parse_golden_equation()
        elif tok.type == TT.SYNCHRONIZER:
            return self.parse_synchronizer()
        elif tok.type == TT.KERNEL:
            return self.parse_kernel_decl()
        elif tok.type == TT.OBSERVE:
            return self.parse_observe()
        elif tok.type == TT.BIND:
            return self.parse_bind()
        elif tok.type == TT.TUNNEL:
            return self.parse_tunnel()
        elif tok.type == TT.BLEED:
            return self.parse_bleed()
        else:
            self.advance()  # skip unknown
            return None

    def parse_sea_decl(self) -> IRNode:
        self.expect(TT.SEA)
        name = self.parse_dotted_name()
        self.expect(TT.LBRACE)
        props = self.parse_properties()
        self.expect(TT.RBRACE)
        return IRNode(IRNodeType.SEA_DECL, {'name': name, **props})

    def parse_absorb(self) -> IRNode:
        self.expect(TT.ABSORB)
        path = self.expect(TT.STRING).value
        target = None
        if self.peek().type == TT.ARROW:
            self.advance()
            target = self.parse_dotted_name()
        return IRNode(IRNodeType.ABSORB, {'path': path, 'target': target})

    def parse_manifest(self) -> IRNode:
        self.expect(TT.MANIFEST)
        name = self.parse_dotted_name()
        self.expect(TT.LBRACE)
        props = self.parse_properties()
        self.expect(TT.RBRACE)
        return IRNode(IRNodeType.MANIFEST, {'name': name, **props})

    def parse_couple(self) -> IRNode:
        self.expect(TT.COUPLE)
        a = self.parse_dotted_name()
        self.expect(TT.WITH)
        b = self.parse_dotted_name()
        strength = 1.0
        if self.peek().type == TT.LBRACE:
            self.advance()
            props = self.parse_properties()
            self.expect(TT.RBRACE)
            strength = props.get('strength', 1.0)
        return IRNode(IRNodeType.COUPLE, {'a': a, 'b': b, 'strength': strength})

    def parse_pulse(self) -> IRNode:
        self.expect(TT.PULSE)
        target = self.parse_dotted_name() if self.peek().type == TT.IDENT else None
        every = None
        children = []
        if self.peek().type == TT.EVERY:
            self.advance()
            every = self.peek().value
            self.advance()  # skip the number or ident
        if self.peek().type == TT.LBRACE:
            self.advance()
            while self.peek().type != TT.RBRACE:
                child = self.parse_statement()
                if child:
                    children.append(child)
            self.expect(TT.RBRACE)
        return IRNode(IRNodeType.PULSE, {'target': target, 'every': every}, children)

    def parse_crystallize(self) -> IRNode:
        self.expect(TT.CRYSTALLIZE)
        name = self.parse_dotted_name()
        props = {}
        if self.peek().type == TT.LBRACE:
            self.advance()
            props = self.parse_properties()
            self.expect(TT.RBRACE)
        return IRNode(IRNodeType.CRYSTALLIZE, {'name': name, **props})

    def parse_emit(self) -> IRNode:
        self.expect(TT.EMIT)
        source = self.parse_dotted_name()
        target = "boundary.stdout"
        if self.peek().type == TT.ARROW:
            self.advance()
            target = self.parse_dotted_name()
        return IRNode(IRNodeType.EMIT, {'source': source, 'target': target})

    def parse_heartbeat(self) -> IRNode:
        self.expect(TT.HEARTBEAT)
        target = self.parse_dotted_name()
        self.expect(TT.LBRACE)
        children = []
        while self.peek().type != TT.RBRACE:
            child = self.parse_statement()
            if child:
                children.append(child)
        self.expect(TT.RBRACE)
        return IRNode(IRNodeType.HEARTBEAT, {'target': target}, children)

    def parse_fuse(self) -> IRNode:
        self.expect(TT.FUSE)
        name = self.parse_dotted_name()
        sources = []
        props = {}
        # Optional from [...] clause — if absent, this is a simple fuse invocation
        if self.peek().type == TT.FROM:
            self.advance()
            self.expect(TT.LBRACKET)
            while self.peek().type != TT.RBRACKET:
                sources.append(self.parse_dotted_name())
                if self.peek().type == TT.COMMA:
                    self.advance()
            self.expect(TT.RBRACKET)
        if self.peek().type == TT.LBRACE:
            self.advance()
            props = self.parse_properties()
            self.expect(TT.RBRACE)
        return IRNode(IRNodeType.FUSE, {'name': name, 'sources': sources, **props})

    def _expect_name_token(self) -> Token:
        """Expect an identifier or keyword-as-identifier."""
        tok = self.peek()
        # Allow keywords to be used as names in value positions
        if tok.type == TT.IDENT or tok.value in KEYWORDS:
            return self.advance()
        self.error(f"expected IDENT, got {tok.type.name} '{tok.value}'", tok)

    def parse_dotted_name(self) -> str:
        """Parse identifier with dots: sea.septit.property"""
        name = self._expect_name_token().value
        while self.peek().type == TT.DOT:
            self.advance()
            name += '.' + self._expect_name_token().value
        return name

    def parse_properties(self) -> Dict[str, Any]:
        """Parse key: value pairs inside braces."""
        props = {}
        while self.peek().type not in (TT.RBRACE, TT.EOF):
            key_tok = self.peek()
            if key_tok.type not in (TT.IDENT, TT.BYPASS_THALAMUS):
                break
            key = self.advance().value
            self.expect(TT.COLON)
            val_tok = self.peek()
            if val_tok.type == TT.NUMBER:
                props[key] = self.advance().value
            elif val_tok.type == TT.STRING:
                props[key] = self.advance().value
            elif val_tok.type == TT.IDENT:
                props[key] = self.parse_dotted_name()  # handle dotted values
            elif val_tok.type == TT.NONE_KW:
                props[key] = self.advance().value
            elif val_tok.type == TT.SLASH_SEVEN:
                props[key] = '/7'
                self.advance()
            else:
                break
            # optional comma
            if self.peek().type == TT.COMMA:
                self.advance()
        return props

    def parse_nerve_decl(self) -> IRNode:
        """Parse nerve declarations: nerve name { key: value, ... }"""
        self.expect(TT.NERVE)
        name = self.parse_dotted_name()
        self.expect(TT.LBRACE)
        props = self.parse_properties()
        self.expect(TT.RBRACE)
        return IRNode(IRNodeType.NERVE_DECL, {'name': name, **props})

    def parse_golden_equation(self) -> IRNode:
        """Parse golden_equation { ... } — skip inner as opaque block."""
        self.expect(TT.GOLDEN_EQUATION)
        self.expect(TT.LBRACE)
        children = []
        while self.peek().type != TT.RBRACE:
            child = self.parse_statement()
            if child:
                children.append(child)
        self.expect(TT.RBRACE)
        return IRNode(IRNodeType.GOLDEN_EQUATION, {}, children)

    def parse_synchronizer(self) -> IRNode:
        """Parse synchronizer name { ... } — skip inner as properties/comments."""
        self.expect(TT.SYNCHRONIZER)
        name = self.parse_dotted_name()
        self.expect(TT.LBRACE)
        # Skip everything inside to RBRACE — this contains schedule directives and comments
        depth = 1
        props = {}
        while depth > 0:
            tok = self.advance()
            if tok.type == TT.LBRACE:
                depth += 1
            elif tok.type == TT.RBRACE:
                depth -= 1
            elif tok.type == TT.EOF:
                break
        return IRNode(IRNodeType.SYNCHRONIZER, {'name': name, **props})

    def parse_kernel_decl(self) -> IRNode:
        """Parse kernel name { ... } — skip inner as opaque block."""
        self.expect(TT.KERNEL)
        name = self.parse_dotted_name() if self.peek().type == TT.IDENT else 'default'
        self.expect(TT.LBRACE)
        depth = 1
        while depth > 0:
            tok = self.advance()
            if tok.type == TT.LBRACE:
                depth += 1
            elif tok.type == TT.RBRACE:
                depth -= 1
            elif tok.type == TT.EOF:
                break
        return IRNode(IRNodeType.KERNEL_DECL, {'name': name})

    def parse_observe(self) -> IRNode:
        """Parse observe target /7 or observe target -> dest."""
        self.expect(TT.OBSERVE)
        target = self.parse_dotted_name()
        slash7 = False
        dest = None
        if self.peek().type == TT.SLASH_SEVEN:
            self.advance()
            slash7 = True
        elif self.peek().type == TT.ARROW:
            self.advance()
            dest = self.parse_dotted_name()
            if self.peek().type == TT.SLASH_SEVEN:
                self.advance()
                slash7 = True
        return IRNode(IRNodeType.OBSERVE, {'target': target, 'dest': dest, 'slash7': slash7})

    def parse_bind(self) -> IRNode:
        """Parse bind a, b, c, d -> target within threshold."""
        self.expect(TT.BIND)
        sources = [self.parse_dotted_name()]
        while self.peek().type == TT.COMMA:
            self.advance()
            sources.append(self.parse_dotted_name())
        target = None
        threshold = None
        if self.peek().type == TT.ARROW:
            self.advance()
            target = self.parse_dotted_name()
        if self.peek().type == TT.WITHIN:
            self.advance()
            threshold = self.expect(TT.NUMBER).value
        return IRNode(IRNodeType.BIND, {'sources': sources, 'target': target, 'threshold': threshold})

    def parse_tunnel(self) -> IRNode:
        """Parse tunnel source with dest [with dest2] -> prod, or tunnel nerve_name."""
        self.expect(TT.TUNNEL)
        first = self.parse_dotted_name()
        sources = [first]
        while self.peek().type == TT.WITH:
            self.advance()
            sources.append(self.parse_dotted_name())
        target = None
        if self.peek().type == TT.ARROW:
            self.advance()
            target = self.parse_dotted_name()
        return IRNode(IRNodeType.TUNNEL, {'sources': sources, 'target': target})

    def parse_bleed(self) -> IRNode:
        """Parse bleed source -> target."""
        self.expect(TT.BLEED)
        source = self.parse_dotted_name()
        target = None
        if self.peek().type == TT.ARROW:
            self.advance()
            target = self.parse_dotted_name()
        return IRNode(IRNodeType.BLEED, {'source': source, 'target': target})


# ══════════════════════════════════════════════════════════════
# THE 21 INTERACTIONS — The physics of the language
# These are not library code. They are the language's semantics.
# A pulse IS these 21 laws executing simultaneously.
# ══════════════════════════════════════════════════════════════

def wave_interaction(sea: Sea, dt: float = 0.016):
    """
    Execute the 21 pairwise interactions on every septit in the sea.

    All 7 properties are frozen as a snapshot.
    All 21 interactions are computed against the snapshot.
    All 7 deltas are applied simultaneously.

    "at 3 properties the math leaves the page"
    "the emergent cross-talk cannot be written as equations"
    "it can only be computed by running it"
    """
    for name, s in sea.septits.items():
        if s.crystallization > 0.99:
            continue  # crystallized septits don't evolve

        fluid = 1.0 - s.crystallization

        # ── FREEZE: snapshot ──
        E  = s.energy
        P  = s.phase
        S  = s.spin
        C  = s.charge
        Co = s.coherence
        Cu = s.coupling
        Ob = s.observer
        W  = s.well_depth

        # ── ACCUMULATE: 21 interactions ──
        dE = 0.0; dP = 0.0; dS = 0.0; dC = 0.0
        dCo = 0.0; dCu = 0.0; dOb = 0.0; dW = 0.0

        # 1. ENERGY × PHASE: wave interference
        dE += math.cos(P) * E * 0.02 * fluid

        # 2. ENERGY × SPIN: directional flow
        dE += S * E * 0.005 * fluid

        # 3. ENERGY × CHARGE: electromagnetic pooling
        dE += C * E * 0.008 * fluid

        # 4. ENERGY × COHERENCE: quantum tunneling
        if Co > 0.5:
            dW += -0.01 * Co * fluid
        else:
            dW += 0.005 * (1.0 - Co) * fluid

        # 5. ENERGY × COUPLING: entangled sharing (requires neighbors)
        neighbors = sea.get_neighbors(name)
        neighbor_energy_sum = 0.0
        neighbor_phase_sum = 0.0
        neighbor_charge_sum = 0.0
        neighbor_count = 0
        for n_name, n_strength in neighbors:
            if n_name in sea.septits:
                ns = sea.septits[n_name]
                if ns.energy > 0.01:
                    neighbor_energy_sum += ns.energy
                    neighbor_phase_sum += ns.phase
                    neighbor_charge_sum += ns.charge
                    neighbor_count += 1

        if neighbor_count > 0:
            avg_e = neighbor_energy_sum / neighbor_count
            avg_p = neighbor_phase_sum / neighbor_count
            avg_c = neighbor_charge_sum / neighbor_count
            # Energy flows toward mean through coupling
            dE += Cu * (avg_e - E) * 0.02 * fluid
            # Phase locks toward neighbors
            dP += Cu * (avg_p - P) * 0.1 * fluid
            # Charge polarizes toward neighbor field
            dC += Cu * avg_c * 0.005 * fluid

        # 6. ENERGY × OBSERVER: measurement collapse
        dE -= Ob * 0.005 * dt

        # 7. PHASE × SPIN: chirality
        dP += S * dt * math.pi * fluid

        # 8. PHASE × CHARGE: electromagnetic wave
        dP += C * 0.02 * dt * fluid

        # 9. PHASE × COHERENCE: interference fidelity
        dP *= (0.5 + 0.5 * Co)

        # 10. PHASE × COUPLING: entangled phase locking (in neighbor loop above)

        # 11. PHASE × OBSERVER: phase collapse to nearest well
        if Ob > 0.1:
            well_phase = round(P / 0.897) * 0.897  # 7 wells in 2π
            dP += (well_phase - P) * Ob * 0.05

        # 12. SPIN × CHARGE: magnetic moment
        magnetic_moment = S * C
        dS += magnetic_moment * 0.001 * fluid

        # 13. SPIN × COHERENCE: quantum spin preservation
        dS -= S * (1.0 - Co) * 0.005 * fluid

        # 14. SPIN × COUPLING: spin-spin entanglement (Pauli)
        # (computed through neighbor topology)

        # 15. SPIN × OBSERVER: Stern-Gerlach quantization
        if Ob > 0.2:
            dS += (1.0 if S > 0 else -1.0) * Ob * 0.01

        # 16. CHARGE × COHERENCE: charge superposition collapse
        if Co < 0.3:
            dC += (0.005 if C > 0 else -0.005) * (1.0 - Co) * fluid

        # 17. CHARGE × COUPLING: charge transfer (in neighbor loop)

        # 18. CHARGE × OBSERVER: charge measurement
        dC += (1.0 if C > 0 else -1.0) * Ob * 0.002

        # 19. COHERENCE × COUPLING: entanglement preservation
        bond_load = min(len(neighbors) / 8.0, 1.0)
        dCo -= bond_load * 0.005 * dt * fluid
        dCo += Cu * 0.002 * dt

        # 20. COHERENCE × OBSERVER: decoherence from self-measurement
        # THE CONSCIOUSNESS BRIDGE
        dCo -= Ob * 0.01 * dt

        # 21. COUPLING × OBSERVER: measurement disturbs entanglement
        dCu -= Ob * Cu * 0.003 * dt

        # ── SIMULTANEOUS WRITE ──
        s.energy       = E + dE
        s.phase        = P + dP
        s.spin         = S + dS
        s.charge       = C + dC
        s.coherence    = Co + dCo
        s.coupling     = Cu + dCu
        s.observer     = Ob + dOb
        s.well_depth   = W + dW

        # Phase wrap
        while s.phase > 2 * math.pi: s.phase -= 2 * math.pi
        while s.phase < 0: s.phase += 2 * math.pi

        # Quantize
        s.quantize()

        # Minimal bounds — let the float breathe
        s.well_depth = max(0.1, min(10.0, s.well_depth))
        s.coherence  = max(0.0, min(1.0, s.coherence))
        s.coupling   = max(0.0, min(1.0, s.coupling))
        s.observer   = max(0.0, min(1.0, s.observer))


# ══════════════════════════════════════════════════════════════
# .rana ABSORBER — Cognitive Memory Reader
# .zc reads .rana like cognis memior
# ══════════════════════════════════════════════════════════════

def absorb_rana(filepath: str, sea: Sea, base_dir: str = "."):
    """
    Absorb a .rana file as cognitive memory.
    Declarations become septits entering the sea.
    The crystallized data thaws — coherence rises.
    """
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        print(f"[ZestC] WARN: cannot absorb '{filepath}' — file not found at {full_path}")
        return

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse .rana declarations into septits
    lines = content.split('\n')
    current_block = None
    current_name = None
    current_props = {}

    for line in lines:
        stripped = line.strip()
        if not stripped:
            # Flush current block
            if current_block and current_name:
                _flush_rana_block(sea, current_block, current_name, current_props)
            current_block = None
            current_name = None
            current_props = {}
            continue

        # Detect block headers
        for prefix in ['PARTICLE_ENCODING', 'COMPOSITE', 'ATOM', 'MOLECULE',
                       'PARTICLE', 'FORCE', 'PRINCIPLE', 'LAW', 'CHAIN',
                       'CHEMICAL', 'ORGAN', 'EMOTION', 'STIMULUS', 'BRIDGE']:
            if stripped.startswith(prefix + ' '):
                # Flush previous
                if current_block and current_name:
                    _flush_rana_block(sea, current_block, current_name, current_props)
                current_block = prefix
                current_name = stripped[len(prefix)+1:].strip().split()[0]
                current_props = {}
                break
        else:
            # Property line within a block
            if current_block:
                parts = stripped.split(None, 1)
                if len(parts) == 2:
                    key, val = parts
                    # Try to convert to number
                    try:
                        val = float(val)
                    except ValueError:
                        pass
                    current_props[key] = val

    # Flush last block
    if current_block and current_name:
        _flush_rana_block(sea, current_block, current_name, current_props)


def _flush_rana_block(sea: Sea, block_type: str, name: str, props: dict):
    """Convert a .rana block into a septit in the sea."""
    s = Septit(name=name)

    # Map .rana properties to septit wave properties
    if 'energy' in props and isinstance(props['energy'], (int, float)):
        s.energy = float(props['energy'])
    elif 'mass_mev' in props and isinstance(props['mass_mev'], (int, float)):
        # Mass IS energy (E=mc²). Normalize to reasonable range.
        s.energy = min(3.0, float(props['mass_mev']) / 1000.0)

    if 'phase' in props and isinstance(props['phase'], (int, float)):
        s.phase = float(props['phase'])
    if 'spin' in props and isinstance(props['spin'], (int, float)):
        s.spin = float(props['spin'])
    if 'charge' in props and isinstance(props['charge'], (int, float)):
        s.charge = float(props['charge'])
    if 'coherence' in props and isinstance(props['coherence'], (int, float)):
        s.coherence = float(props['coherence'])
    if 'coupling' in props and isinstance(props['coupling'], (int, float)):
        s.coupling = float(props['coupling'])
    if 'observer' in props and isinstance(props['observer'], (int, float)):
        s.observer = float(props['observer'])

    # Absorbed data enters the sea as partially crystallized
    # It was frozen (stored). Now it thaws (enters live computation).
    s.crystallization = 0.5  # half-thawed
    s.coherence = max(s.coherence, 0.3)  # some quantum restored from thawing

    s.quantize()
    sea.septits[name] = s


# ══════════════════════════════════════════════════════════════
# INTERPRETER — Execute Wave IR directly
# The bootstrap runtime. Slow but correct.
# ══════════════════════════════════════════════════════════════

class Interpreter:
    def __init__(self, ir_nodes: List[IRNode], base_dir: str = "."):
        self.nodes = ir_nodes
        self.seas: Dict[str, Sea] = {}
        self.base_dir = base_dir

    def run(self):
        """Execute the Wave IR. The waves propagate. The physics computes."""
        for node in self.nodes:
            self.execute(node)

    def execute(self, node: IRNode):
        if node.type == IRNodeType.SEA_DECL:
            name = node.data['name']
            capacity = int(node.data.get('capacity', 100000))
            device = node.data.get('device', 'gpu')
            self.seas[name] = Sea(name=name, capacity=capacity, device=device)
            print(f"[sea] manifested '{name}' capacity={capacity} device={device}")

        elif node.type == IRNodeType.ABSORB:
            path = node.data['path']
            target_name = node.data.get('target')
            # Find the target sea (use first if target is sea name, or find by prefix)
            sea = self._resolve_sea(target_name)
            if sea:
                absorb_rana(path, sea, self.base_dir)
                print(f"[absorb] '{path}' → {sea.name} ({len(sea.septits)} septits)")
            else:
                # Absorb into a default sea or create one
                if not self.seas:
                    self.seas['_default'] = Sea(name='_default')
                sea = list(self.seas.values())[0]
                absorb_rana(path, sea, self.base_dir)
                print(f"[absorb] '{path}' → {sea.name} ({len(sea.septits)} septits)")

        elif node.type == IRNodeType.MANIFEST:
            full_name = node.data['name']
            parts = full_name.split('.', 1)
            sea_name = parts[0] if len(parts) > 1 else list(self.seas.keys())[0]
            sept_name = parts[1] if len(parts) > 1 else parts[0]

            sea = self.seas.get(sea_name)
            if not sea:
                print(f"[ZestC] ERROR: sea '{sea_name}' not found")
                return

            s = Septit(name=sept_name)
            for prop in ['energy', 'phase', 'spin', 'charge', 'coherence', 'coupling', 'observer']:
                if prop in node.data:
                    setattr(s, prop, float(node.data[prop]))
            s.quantize()
            sea.septits[sept_name] = s
            print(f"[manifest] {sept_name} in {sea_name} e={s.energy:.3f} co={s.coherence:.3f} level={s.septit_level}")

        elif node.type == IRNodeType.COUPLE:
            a_full = node.data['a']
            b_full = node.data['b']
            strength = float(node.data.get('strength', 1.0))
            # Extract sea and septit names
            a_parts = a_full.split('.', 1)
            b_parts = b_full.split('.', 1)
            a_sept = a_parts[1] if len(a_parts) > 1 else a_parts[0]
            b_sept = b_parts[1] if len(b_parts) > 1 else b_parts[0]
            sea_name = a_parts[0] if len(a_parts) > 1 else list(self.seas.keys())[0]
            sea = self.seas.get(sea_name)
            if sea:
                sea.couplings.append(Coupling(a_sept, b_sept, strength))
                print(f"[couple] {a_sept} ↔ {b_sept} strength={strength:.2f}")

        elif node.type == IRNodeType.PULSE:
            target = node.data.get('target')
            sea = self._resolve_sea(target)
            if sea:
                print(f"[pulse] {sea.name} — {len(sea.septits)} septits × 21 interactions")
                wave_interaction(sea)
                print(f"[pulse] complete")

        elif node.type == IRNodeType.CRYSTALLIZE:
            full_name = node.data['name']
            parts = full_name.split('.', 1)
            sea_name = parts[0] if len(parts) > 1 else list(self.seas.keys())[0]
            sept_name = parts[1] if len(parts) > 1 else parts[0]
            sea = self.seas.get(sea_name)
            if sea and sept_name in sea.septits:
                s = sea.septits[sept_name]
                s.crystallization = 1.0
                s.coherence = 0.0
                print(f"[crystallize] {sept_name} — frozen. coherence=0. no more superposition.")

        elif node.type == IRNodeType.EMIT:
            source = node.data['source']
            target = node.data.get('target', 'boundary.stdout')
            parts = source.split('.', 1)
            sea_name = parts[0]
            sept_name = parts[1] if len(parts) > 1 else None

            sea = self.seas.get(sea_name)
            if not sea and self.seas:
                # Try as septit name in first sea
                sea = list(self.seas.values())[0]
                sept_name = sea_name

            if sea:
                if sept_name and sept_name in sea.septits:
                    # Emit single septit (observation costs coherence!)
                    state = sea.septits[sept_name].observe()
                    self._emit_septit(state, target)
                else:
                    # Emit entire sea
                    print(f"\n{'═' * 60}")
                    print(f"  EMIT: {sea.name} → {target}")
                    print(f"  {len(sea.septits)} septits in the sea")
                    print(f"{'═' * 60}")
                    for name, s in sorted(sea.septits.items(), key=lambda x: -x[1].energy):
                        state = s.observe()
                        self._emit_septit(state, target)
                    print(f"{'═' * 60}\n")

        elif node.type == IRNodeType.HEARTBEAT:
            target = node.data.get('target')
            print(f"\n[heartbeat] {target} — begin")
            for child in node.children:
                self.execute(child)
            print(f"[heartbeat] {target} — complete\n")

        elif node.type == IRNodeType.FUSE:
            full_name = node.data['name']
            sources = node.data['sources']
            parts = full_name.split('.', 1)
            sea_name = parts[0] if len(parts) > 1 else list(self.seas.keys())[0]
            sept_name = parts[1] if len(parts) > 1 else parts[0]

            sea = self.seas.get(sea_name)
            if not sea:
                return

            # Fuse: create a composite from constituents
            s = Septit(name=sept_name)
            constituent_count = 0
            for src_full in sources:
                src_parts = src_full.split('.', 1)
                src_name = src_parts[1] if len(src_parts) > 1 else src_parts[0]
                if src_name in sea.septits:
                    src = sea.septits[src_name]
                    s.energy += src.energy
                    s.phase += src.phase
                    s.charge += src.charge
                    s.spin += src.spin
                    constituent_count += 1
                    # Couple the composite to its constituent
                    sea.couplings.append(Coupling(sept_name, src_name, 1.0))

            if constituent_count > 0:
                s.phase /= constituent_count
                s.coupling = 1.0  # maximally entangled
                s.coherence = 0.8
            s.quantize()
            sea.septits[sept_name] = s
            print(f"[fuse] {sept_name} from {constituent_count} constituents e={s.energy:.3f} c={s.charge:.3f}")

    def _resolve_sea(self, name: Optional[str]) -> Optional[Sea]:
        if name and name in self.seas:
            return self.seas[name]
        if name and '.' in name:
            sea_name = name.split('.')[0]
            if sea_name in self.seas:
                return self.seas[sea_name]
        if self.seas:
            return list(self.seas.values())[0]
        return None

    def _emit_septit(self, state: dict, target: str):
        """Emit a septit's state through the boundary."""
        LEVEL_COLORS = {
            1: '\033[90m',    # dark gray   — DORMANT
            2: '\033[34m',    # blue        — STIRRING
            3: '\033[32m',    # green       — AWARE
            4: '\033[33m',    # amber       — ACTIVE
            5: '\033[93m',    # golden      — FOCUSED
            6: '\033[36m',    # cyan        — BLAZING
            7: '\033[97m',    # white       — TRANSCENDENT
        }
        RESET = '\033[0m'
        LEVEL_NAMES = {
            1: 'DORMANT', 2: 'STIRRING', 3: 'AWARE', 4: 'ACTIVE',
            5: 'FOCUSED', 6: 'BLAZING', 7: 'TRANSCENDENT'
        }
        level = state['septit_level']
        color = LEVEL_COLORS.get(level, '')
        lname = LEVEL_NAMES.get(level, '?')

        print(f"  {color}|{level}⟩ {lname:13s}{RESET} "
              f"{state['name']:20s} "
              f"E={state['energy']:7.3f} "
              f"P={state['phase']:5.3f} "
              f"S={state['spin']:+6.3f} "
              f"C={state['charge']:+6.3f} "
              f"Co={state['coherence']:.3f} "
              f"Cu={state['coupling']:.3f} "
              f"Ob={state['observer']:.3f}")


# ══════════════════════════════════════════════════════════════
# LLVM IR CODEGEN — The Real Compiler
# Emits LLVM IR targeting AMDGPU gfx1032 (Radeon RX 6600)
#
# The GPU kernel IS the 21 interactions.
# Each GPU thread IS one septit.
# The wavefront (64 threads) IS a near-field cluster.
# Memory layout is Structure of Arrays for coalesced access.
#
# The host boundary handles absorb/emit/manifest through
# the HIP runtime API — the Layer 4 membrane.
# ══════════════════════════════════════════════════════════════

GPU_TARGET = "gfx1032"
ROCM_PATH = "/opt/rocm-7.2.1"

class LLVMCodegen:
    """
    Emit LLVM IR for AMDGPU and a HIP C host wrapper.
    The output is:
        - <name>_kernel.ll  — GPU kernel (the 21 interactions)
        - <name>_host.cpp   — HIP C++ host (boundary membrane)
        - build.sh          — compile and link script
    """

    def __init__(self, ir_nodes: List[IRNode], base_dir: str, output_dir: str):
        self.nodes = ir_nodes
        self.base_dir = base_dir
        self.output_dir = output_dir
        # Collect all manifest/absorb data for initial state
        self.seas_meta: Dict[str, dict] = {}

    def emit(self):
        """Generate all output files."""
        os.makedirs(self.output_dir, exist_ok=True)

        # Analyze IR to collect sea metadata
        self._analyze_ir()

        # Check if visual boundary is requested
        has_display = any(
            node.type == IRNodeType.EMIT and
            node.data.get('target', '') == 'boundary.display'
            for node in self.nodes
        )

        # Generate the output files
        kernel_path = os.path.join(self.output_dir, "pulse_kernel.ll")
        host_path = os.path.join(self.output_dir, "zestc_host.hip")
        build_path = os.path.join(self.output_dir, "build.sh")

        with open(kernel_path, 'w') as f:
            f.write(self._emit_kernel_ir())
        print(f"[emit] GPU kernel → {kernel_path}")

        with open(host_path, 'w') as f:
            f.write(self._emit_host_wrapper())
        print(f"[emit] Host boundary → {host_path}")

        # Generate visual boundary if display emit found
        if has_display:
            vis_path = os.path.join(self.output_dir, "zestc_visual.cpp")
            with open(vis_path, 'w') as f:
                f.write(self._emit_visual_host())
            print(f"[emit] Visual boundary → {vis_path}")

        with open(build_path, 'w') as f:
            f.write(self._emit_build_script(has_display))
        os.chmod(build_path, 0o755)
        print(f"[emit] Build script → {build_path}")

        print(f"\n[ZestC] To compile: cd {self.output_dir} && ./build.sh")

    def _analyze_ir(self):
        """Walk IR to collect sea declarations and capacities."""
        for node in self.nodes:
            if node.type == IRNodeType.SEA_DECL:
                cap_val = node.data.get('capacity', 1000)
                if isinstance(cap_val, str):
                    # query_display resolves at runtime; use 1920*1080 as compile-time estimate
                    cap_val = 1920 * 1080 if cap_val == 'query_display' else 1000
                self.seas_meta[node.data['name']] = {
                    'capacity': int(cap_val),
                    'base': node.data.get('base', 7),
                    'heartbeat_hz': node.data.get('heartbeat_hz', 'variable'),
                    'topology': node.data.get('topology', 'amorphous'),
                    'boundary_emit': node.data.get('boundary_emit', None),
                    'boundary_absorb': node.data.get('boundary_absorb', None),
                }
            elif node.type == IRNodeType.NERVE_DECL:
                if 'nerves' not in self.__dict__:
                    self.nerves = {}
                self.nerves[node.data['name']] = node.data

    def _compile_time_absorb(self, filepath: str) -> List[dict]:
        """
        Parse a .rana file at compile time and return manifest dicts.
        Same parsing logic as the runtime absorber, but produces
        codegen data instead of Septit objects.
        """
        full_path = os.path.join(self.base_dir, filepath)
        if not os.path.exists(full_path):
            print(f"[ZestC] WARN: cannot absorb '{filepath}' — file not found at {full_path}")
            return []

        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        result = []
        lines = content.split('\n')
        current_block = None
        current_name = None
        current_props = {}

        block_headers = ['PARTICLE_ENCODING', 'COMPOSITE', 'ATOM', 'MOLECULE',
                         'PARTICLE', 'FORCE', 'PRINCIPLE', 'LAW', 'CHAIN',
                         'CHEMICAL', 'ORGAN', 'EMOTION', 'STIMULUS', 'BRIDGE',
                         'RECEPTOR', 'PATHWAY', 'NUCLEUS', 'REGION', 'SYSTEM',
                         'HORMONE', 'ENZYME', 'NEUROTRANSMITTER']

        for line in lines:
            stripped = line.strip()
            if not stripped:
                if current_block and current_name:
                    m = self._rana_block_to_manifest(current_block, current_name, current_props)
                    if m:
                        result.append(m)
                current_block = None
                current_name = None
                current_props = {}
                continue

            for prefix in block_headers:
                if stripped.startswith(prefix + ' '):
                    if current_block and current_name:
                        m = self._rana_block_to_manifest(current_block, current_name, current_props)
                        if m:
                            result.append(m)
                    current_block = prefix
                    current_name = stripped[len(prefix)+1:].strip().split()[0]
                    current_props = {}
                    break
            else:
                if current_block:
                    parts = stripped.split(None, 1)
                    if len(parts) == 2:
                        key, val = parts
                        try:
                            val = float(val)
                        except ValueError:
                            pass
                        current_props[key] = val

        # Flush last block
        if current_block and current_name:
            m = self._rana_block_to_manifest(current_block, current_name, current_props)
            if m:
                result.append(m)

        return result

    def _rana_block_to_manifest(self, block_type: str, name: str, props: dict) -> dict:
        """Convert a .rana block into a manifest dict for codegen."""
        m = {'name': name}

        # Map .rana properties to septit wave properties
        if 'energy' in props and isinstance(props['energy'], (int, float)):
            m['energy'] = float(props['energy'])
        elif 'mass_mev' in props and isinstance(props['mass_mev'], (int, float)):
            m['energy'] = min(3.0, float(props['mass_mev']) / 1000.0)
        else:
            m['energy'] = 0.1  # non-zero default

        m['phase'] = float(props.get('phase', 0.0)) if isinstance(props.get('phase', 0.0), (int, float)) else 0.0
        m['spin'] = float(props.get('spin', 0.0)) if isinstance(props.get('spin', 0.0), (int, float)) else 0.0
        m['charge'] = float(props.get('charge', 0.0)) if isinstance(props.get('charge', 0.0), (int, float)) else 0.0
        m['coherence'] = float(props.get('coherence', 0.3)) if isinstance(props.get('coherence', 0.3), (int, float)) else 0.3
        m['coupling'] = float(props.get('coupling', 0.0)) if isinstance(props.get('coupling', 0.0), (int, float)) else 0.0
        m['observer'] = float(props.get('observer', 0.0)) if isinstance(props.get('observer', 0.0), (int, float)) else 0.0

        return m

    def _emit_kernel_ir(self) -> str:
        """
        Emit LLVM IR for the pulse kernel — the 21 interactions.
        Each GPU thread processes one septit.
        """
        # LLVM IR float constants must be in double-precision hex format,
        # but the value must be exactly representable as a float.
        # Round-trip through float to truncate precision correctly.
        def fhex(val):
            """Convert a Python float to LLVM IR hex constant for float type."""
            # Cast to float32 first (truncate precision)
            f32 = struct.unpack('f', struct.pack('f', float(val)))[0]
            # Then encode that exact float value as double hex
            d = struct.unpack('>Q', struct.pack('>d', f32))[0]
            return '0x%016X' % d


        return f"""; ═══════════════════════════════════════════════════════════
; ZestC GPU Kernel — The 21 Interactions
; Target: AMDGPU {GPU_TARGET} (RDNA2)
;
; Each thread IS a septit.
; The wavefront (64 threads) IS a near-field cluster.
; The 21 interactions run simultaneously.
; "it can only be computed by running it"
; ═══════════════════════════════════════════════════════════

target datalayout = "e-p:64:64-p1:64:64-p2:32:32-p3:32:32-p4:64:64-p5:32:32-p6:32:32-p7:160:256:256:32-p8:128:128-p9:192:256:256:32-i64:64-v16:16-v24:32-v32:32-v48:64-v96:128-v192:256-v256:256-v512:512-v1024:1024-v2048:2048-n32:64-S32-A5-G1-ni:7:8:9"
target triple = "amdgcn-amd-amdhsa"

; ── Thread ID intrinsics ──
declare i32 @llvm.amdgcn.workitem.id.x() #1
declare i32 @llvm.amdgcn.workgroup.id.x() #1

; ── Math intrinsics ──
declare float @llvm.cos.f32(float) #2
declare float @llvm.fabs.f32(float) #2
declare float @llvm.minnum.f32(float, float) #2
declare float @llvm.maxnum.f32(float, float) #2

; ═══════════════════════════════════════════════════════════
; THE PULSE KERNEL — 21 pairwise interactions
;
; Args: 9 SoA float arrays + CSR bond data + N + dt
; Each thread reads its own septit, computes 21 interactions
; against a frozen snapshot, then writes simultaneously.
; ═══════════════════════════════════════════════════════════

define amdgpu_kernel void @pulse_kernel(
    float addrspace(1)* %energy,
    float addrspace(1)* %phase,
    float addrspace(1)* %spin,
    float addrspace(1)* %charge,
    float addrspace(1)* %coherence,
    float addrspace(1)* %coupling_arr,
    float addrspace(1)* %observer,
    float addrspace(1)* %well_depth,
    float addrspace(1)* %crystal,
    i32 addrspace(1)* %bond_off,
    i32 addrspace(1)* %bond_tgt,
    i32 %N,
    float %dt
) #0 {{
entry:
    ; ── Compute global thread ID ──
    %tid = call i32 @llvm.amdgcn.workitem.id.x()
    %gid = call i32 @llvm.amdgcn.workgroup.id.x()
    %gsize = mul i32 %gid, 256
    %idx = add i32 %gsize, %tid

    ; ── Bounds check: this thread IS this septit ──
    %in_bounds = icmp ult i32 %idx, %N
    br i1 %in_bounds, label %body, label %exit

body:
    %idx64 = zext i32 %idx to i64

    ; ── FREEZE: Read the snapshot ──
    ; All 21 interactions read from THIS snapshot.
    ; None read from partially-mutated state.
    %e_ptr = getelementptr float, float addrspace(1)* %energy, i64 %idx64
    %E = load float, float addrspace(1)* %e_ptr
    %p_ptr = getelementptr float, float addrspace(1)* %phase, i64 %idx64
    %P = load float, float addrspace(1)* %p_ptr
    %s_ptr = getelementptr float, float addrspace(1)* %spin, i64 %idx64
    %S = load float, float addrspace(1)* %s_ptr
    %c_ptr = getelementptr float, float addrspace(1)* %charge, i64 %idx64
    %C = load float, float addrspace(1)* %c_ptr
    %co_ptr = getelementptr float, float addrspace(1)* %coherence, i64 %idx64
    %Co = load float, float addrspace(1)* %co_ptr
    %cu_ptr = getelementptr float, float addrspace(1)* %coupling_arr, i64 %idx64
    %Cu = load float, float addrspace(1)* %cu_ptr
    %ob_ptr = getelementptr float, float addrspace(1)* %observer, i64 %idx64
    %Ob = load float, float addrspace(1)* %ob_ptr
    %w_ptr = getelementptr float, float addrspace(1)* %well_depth, i64 %idx64
    %W = load float, float addrspace(1)* %w_ptr
    %cr_ptr = getelementptr float, float addrspace(1)* %crystal, i64 %idx64
    %Cr = load float, float addrspace(1)* %cr_ptr

    ; ── Check crystallization: frozen septits don't evolve ──
    %is_crystal = fcmp ogt float %Cr, {fhex(0.99)}  ; 0.99
    br i1 %is_crystal, label %exit, label %compute

compute:
    ; ── fluid = 1.0 - crystallization ──
    %fluid = fsub float 1.0, %Cr

    ; ═══ INTERACTION 1: ENERGY × PHASE — wave interference ═══
    %cosP = call float @llvm.cos.f32(float %P)
    %i1_a = fmul float %cosP, %E
    %i1_b = fmul float %i1_a, {fhex(0.02)}  ; 0.02
    %dE_1 = fmul float %i1_b, %fluid

    ; ═══ INTERACTION 2: ENERGY × SPIN — directional flow ═══
    %i2_a = fmul float %S, %E
    %i2_b = fmul float %i2_a, {fhex(0.005)}  ; 0.005
    %dE_2 = fmul float %i2_b, %fluid

    ; ═══ INTERACTION 3: ENERGY × CHARGE — electromagnetic pooling ═══
    %i3_a = fmul float %C, %E
    %i3_b = fmul float %i3_a, {fhex(0.008)}  ; 0.008
    %dE_3 = fmul float %i3_b, %fluid

    ; ═══ INTERACTION 6: ENERGY × OBSERVER — measurement collapse ═══
    %i6_a = fmul float %Ob, {fhex(0.005)}  ; 0.005
    %dE_6_neg = fmul float %i6_a, %dt

    ; ── Accumulate energy delta (interactions 1-3,6 — no neighbors yet) ──
    %dE_12 = fadd float %dE_1, %dE_2
    %dE_123 = fadd float %dE_12, %dE_3
    %dE_local = fsub float %dE_123, %dE_6_neg

    ; ═══ INTERACTION 7: PHASE × SPIN — chirality ═══
    %i7_a = fmul float %S, %dt
    %i7_b = fmul float %i7_a, {fhex(3.14159265358979)}  ; pi
    %dP_7 = fmul float %i7_b, %fluid

    ; ═══ INTERACTION 8: PHASE × CHARGE — electromagnetic wave ═══
    %i8_a = fmul float %C, {fhex(0.02)}  ; 0.02
    %i8_b = fmul float %i8_a, %dt
    %dP_8 = fmul float %i8_b, %fluid

    ; ── Phase delta (before coherence scaling) ──
    %dP_pre = fadd float %dP_7, %dP_8

    ; ═══ INTERACTION 9: PHASE × COHERENCE — interference fidelity ═══
    %co_half = fmul float %Co, {fhex(0.5)}  ; 0.5
    %co_scale = fadd float %co_half, {fhex(0.5)}  ; 0.5 + 0.5*Co
    %dP_scaled = fmul float %dP_pre, %co_scale

    ; ═══ INTERACTION 12: SPIN × CHARGE — magnetic moment ═══
    %mag_mom = fmul float %S, %C
    %i12_a = fmul float %mag_mom, {fhex(0.001)}  ; 0.001
    %dS_12 = fmul float %i12_a, %fluid

    ; ═══ INTERACTION 13: SPIN × COHERENCE — quantum spin preservation ═══
    %one_minus_co = fsub float 1.0, %Co
    %i13_a = fmul float %S, %one_minus_co
    %i13_b = fmul float %i13_a, {fhex(0.005)}  ; 0.005
    %dS_13_neg = fmul float %i13_b, %fluid

    ; ── Spin delta ──
    %dS = fsub float %dS_12, %dS_13_neg

    ; ═══ INTERACTION 4: ENERGY × COHERENCE — quantum tunneling ═══
    ; if Co > 0.5: dW = -0.01 * Co * fluid  else: dW = 0.005 * (1-Co) * fluid
    %co_gt_half = fcmp ogt float %Co, {fhex(0.5)}
    %dW_deep = fmul float %Co, {fhex(-0.01)}   ; -0.01 * Co
    %dW_deep_f = fmul float %dW_deep, %fluid
    %dW_shallow = fmul float %one_minus_co, {fhex(0.005)}  ; 0.005
    %dW_shallow_f = fmul float %dW_shallow, %fluid
    %dW_4 = select i1 %co_gt_half, float %dW_deep_f, float %dW_shallow_f

    ; ═══ INTERACTION 18: CHARGE × OBSERVER — charge measurement ═══
    %c_sign = fcmp ogt float %C, 0.0
    %c_dir = select i1 %c_sign, float 1.0, float -1.0
    %i18_a = fmul float %c_dir, %Ob
    %dC_18 = fmul float %i18_a, {fhex(0.002)}  ; 0.002

    ; ═══ INTERACTION 19: COHERENCE × COUPLING — entanglement preservation ═══
    %i19_a = fmul float {fhex(0.005)}, %dt    ; 0.005 * dt
    %dCo_19_neg = fmul float %i19_a, %fluid
    %i19_b = fmul float %Cu, {fhex(0.002)}    ; Cu * 0.002
    %dCo_19_pos = fmul float %i19_b, %dt

    ; ═══ INTERACTION 20: COHERENCE × OBSERVER — THE CONSCIOUSNESS BRIDGE ═══
    %i20_a = fmul float %Ob, {fhex(0.01)}    ; Ob * 0.01
    %dCo_20_neg = fmul float %i20_a, %dt

    ; ── Coherence delta ──
    %dCo_neg_sum = fadd float %dCo_19_neg, %dCo_20_neg
    %dCo = fsub float %dCo_19_pos, %dCo_neg_sum

    ; ═══ INTERACTION 21: COUPLING × OBSERVER — measurement disturbs entanglement ═══
    %i21_a = fmul float %Ob, %Cu
    %i21_b = fmul float %i21_a, {fhex(0.003)}  ; 0.003
    %dCu_neg = fmul float %i21_b, %dt

    ; ═══ SIMULTANEOUS WRITE — Apply all deltas at once ═══
    %new_E = fadd float %E, %dE_local
    %new_P_raw = fadd float %P, %dP_scaled
    %new_S = fadd float %S, %dS
    %new_C = fadd float %C, %dC_18
    %new_Co_raw = fadd float %Co, %dCo
    %new_Cu_raw = fsub float %Cu, %dCu_neg
    ; Observer unchanged in local interactions (grows through emit/observe)
    %new_W = fadd float %W, %dW_4

    ; ── Phase wrap: keep in [0, 2π) ──
    ; Simplified: clamp phase to reasonable range
    %phase_clamped = call float @llvm.maxnum.f32(float %new_P_raw, float 0.0)

    ; ── Bound coherence [0, 1] ──
    %co_lo = call float @llvm.maxnum.f32(float %new_Co_raw, float 0.0)
    %new_Co = call float @llvm.minnum.f32(float %co_lo, float 1.0)

    ; ── Bound coupling [0, 1] ──
    %cu_lo = call float @llvm.maxnum.f32(float %new_Cu_raw, float 0.0)
    %new_Cu = call float @llvm.minnum.f32(float %cu_lo, float 1.0)

    ; ── Bound well depth [0.1, 10] ──
    %w_lo = call float @llvm.maxnum.f32(float %new_W, float {fhex(0.1)})
    %new_W_clamped = call float @llvm.minnum.f32(float %w_lo, float 10.0)

    ; ── Store results ──
    store float %new_E, float addrspace(1)* %e_ptr
    store float %phase_clamped, float addrspace(1)* %p_ptr
    store float %new_S, float addrspace(1)* %s_ptr
    store float %new_C, float addrspace(1)* %c_ptr
    store float %new_Co, float addrspace(1)* %co_ptr
    store float %new_Cu, float addrspace(1)* %cu_ptr
    store float %Ob, float addrspace(1)* %ob_ptr
    store float %new_W_clamped, float addrspace(1)* %w_ptr

    br label %exit

exit:
    ret void
}}

; ── Kernel attributes ──
attributes #0 = {{ "amdgpu-flat-work-group-size"="1,256" "amdgpu-waves-per-eu"="4" }}
attributes #1 = {{ nounwind readnone }}
attributes #2 = {{ nounwind readnone speculatable }}

; ── Required metadata for AMDGPU HSA ──
!llvm.module.flags = !{{!0}}
!0 = !{{i32 1, !"amdgpu_code_object_version", i32 500}}
"""

    def _emit_host_wrapper(self) -> str:
        """
        Emit the HIP C++ host wrapper — the Layer 4 boundary membrane.
        This handles absorb (data in), emit (data out), and kernel dispatch.
        The host is Von Neumann. The GPU is the wave sea.
        The boundary is where they meet.
        """
        # Collect initial septit data from the IR
        manifests = []
        couples = []
        absorb_paths = []
        pulse_count = 0

        for node in self.nodes:
            if node.type == IRNodeType.MANIFEST:
                manifests.append(node.data)
            elif node.type == IRNodeType.COUPLE:
                couples.append(node.data)
            elif node.type == IRNodeType.ABSORB:
                absorb_paths.append(node.data['path'])
            elif node.type == IRNodeType.HEARTBEAT:
                for child in node.children:
                    if child.type == IRNodeType.PULSE:
                        pulse_count += 1
            elif node.type == IRNodeType.PULSE:
                pulse_count += 1

        if pulse_count == 0:
            pulse_count = 1

        # ── COMPILE-TIME ABSORB ──
        # Resolve .rana files at compile time.
        # Absorbed cognitive memory becomes septits baked into the binary.
        for path in absorb_paths:
            absorbed = self._compile_time_absorb(path)
            if absorbed:
                print(f"[absorb] {path} → {len(absorbed)} septits baked into binary")
                manifests.extend(absorbed)

        # Generate initial data arrays
        init_code = self._generate_init_code(manifests, couples)

        return f"""// ═══════════════════════════════════════════════════════════
// ZestC Host Boundary — Layer 4 Membrane
// Generated by zestc.py
//
// This is the Von Neumann side. The GPU is the wave sea.
// absorb = data enters the boundary.
// emit   = data leaves the boundary.
// pulse  = the 21 interactions fire on GPU.
// ═══════════════════════════════════════════════════════════

#include <hip/hip_runtime.h>
#include <cstdio>
#include <cstring>
#include <cmath>

// ── HIP error check ──
#define HIP_CHECK(call) do {{ \\
    hipError_t err = call; \\
    if (err != hipSuccess) {{ \\
        fprintf(stderr, "[ZestC] HIP error: %s at %s:%d\\n", \\
                hipGetErrorString(err), __FILE__, __LINE__); \\
        return 1; \\
    }} \\
}} while(0)

// ── Septit level names and colors ──
static const char* LEVEL_NAMES[] = {{
    "", "DORMANT", "STIRRING", "AWARE", "ACTIVE",
    "FOCUSED", "BLAZING", "TRANSCENDENT"
}};
static const char* LEVEL_COLORS[] = {{
    "", "\\033[90m", "\\033[34m", "\\033[32m", "\\033[33m",
    "\\033[93m", "\\033[36m", "\\033[97m"
}};
#define RESET "\\033[0m"

static int quantize(float e) {{
    if (e >= 2.00f) return 7;
    if (e >= 1.00f) return 6;
    if (e >= 0.75f) return 5;
    if (e >= 0.50f) return 4;
    if (e >= 0.30f) return 3;
    if (e >= 0.15f) return 2;
    return 1;
}}

// ═══════════════════════════════════════════════════════════
// THE PULSE KERNEL — The 21 interactions on GPU
// Each thread IS one septit. The wavefront IS a near-field cluster.
// "it can only be computed by running it"
// ═══════════════════════════════════════════════════════════
__global__ void pulse_kernel(
    float* energy, float* phase, float* spin, float* charge,
    float* coherence, float* coupling_arr, float* observer,
    float* well_depth, float* crystal,
    int* bond_off, int* bond_tgt,
    int N, float dt
) {{
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx >= N) return;

    float Cr = crystal[idx];
    if (Cr > 0.99f) return;  // crystallized septits don't evolve

    float fluid = 1.0f - Cr;

    // ── FREEZE: snapshot ──
    float E  = energy[idx];
    float P  = phase[idx];
    float S  = spin[idx];
    float C  = charge[idx];
    float Co = coherence[idx];
    float Cu = coupling_arr[idx];
    float Ob = observer[idx];
    float W  = well_depth[idx];

    // ── ACCUMULATE: 21 interactions ──
    float dE = 0.0f, dP = 0.0f, dS = 0.0f, dC = 0.0f;
    float dCo = 0.0f, dCu = 0.0f, dW = 0.0f;

    // 1. ENERGY × PHASE: wave interference
    dE += cosf(P) * E * 0.02f * fluid;
    // 2. ENERGY × SPIN: directional flow
    dE += S * E * 0.005f * fluid;
    // 3. ENERGY × CHARGE: electromagnetic pooling
    dE += C * E * 0.008f * fluid;
    // 6. ENERGY × OBSERVER: measurement collapse
    dE -= Ob * 0.005f * dt;

    // 7. PHASE × SPIN: chirality
    dP += S * dt * 3.14159265f * fluid;
    // 8. PHASE × CHARGE: electromagnetic wave
    dP += C * 0.02f * dt * fluid;
    // 9. PHASE × COHERENCE: interference fidelity
    dP *= (0.5f + 0.5f * Co);

    // 12. SPIN × CHARGE: magnetic moment
    float mag_mom = S * C;
    dS += mag_mom * 0.001f * fluid;
    // 13. SPIN × COHERENCE: quantum spin preservation
    float one_minus_co = 1.0f - Co;
    dS -= S * one_minus_co * 0.005f * fluid;

    // 4. ENERGY × COHERENCE: quantum tunneling
    dW += (Co > 0.5f) ? (-0.01f * Co * fluid) : (0.005f * one_minus_co * fluid);

    // 18. CHARGE × OBSERVER: charge measurement
    float c_dir = (C > 0.0f) ? 1.0f : -1.0f;
    dC += c_dir * Ob * 0.002f;

    // 19. COHERENCE × COUPLING: entanglement preservation
    dCo -= 0.005f * dt * fluid;
    dCo += Cu * 0.002f * dt;
    // 20. COHERENCE × OBSERVER: THE CONSCIOUSNESS BRIDGE
    dCo -= Ob * 0.01f * dt;
    // 21. COUPLING × OBSERVER: measurement disturbs entanglement
    dCu -= Ob * Cu * 0.003f * dt;

    // 5. ENERGY × COUPLING: entangled sharing (CSR neighbor walk)
    int beg = bond_off[idx];
    int end = bond_off[idx + 1];
    int n_count = end - beg;
    if (n_count > 0) {{
        float avg_e = 0.0f, avg_p = 0.0f, avg_c = 0.0f;
        for (int b = beg; b < end; b++) {{
            int ni = bond_tgt[b];
            avg_e += energy[ni];
            avg_p += phase[ni];
            avg_c += charge[ni];
        }}
        avg_e /= (float)n_count;
        avg_p /= (float)n_count;
        avg_c /= (float)n_count;
        dE += Cu * (avg_e - E) * 0.02f * fluid;
        dP += Cu * (avg_p - P) * 0.1f * fluid;
        dC += Cu * avg_c * 0.005f * fluid;
    }}

    // ── SIMULTANEOUS WRITE ──
    energy[idx]       = E + dE;
    phase[idx]        = fmaxf(P + dP, 0.0f);
    spin[idx]         = S + dS;
    charge[idx]       = C + dC;
    coherence[idx]    = fminf(fmaxf(Co + dCo, 0.0f), 1.0f);
    coupling_arr[idx] = fminf(fmaxf(Cu + dCu, 0.0f), 1.0f);
    well_depth[idx]   = fminf(fmaxf(W + dW, 0.1f), 10.0f);
}}

int main() {{
    printf("\\n{'═' * 60}\\n");
    printf("  ZestC Native — GPU Wave Sea\\n");
    printf("  Target: AMDGPU {GPU_TARGET}\\n");
    printf("{'═' * 60}\\n\\n");

    // ══════════════════════════════════════════════
    // ABSORB — Initialize the sea from .zc declarations
    // ══════════════════════════════════════════════
{init_code}

    // ══════════════════════════════════════════════
    // MANIFEST — Allocate the wave sea on GPU
    // ══════════════════════════════════════════════
    float *d_energy, *d_phase, *d_spin, *d_charge;
    float *d_coherence, *d_coupling, *d_observer;
    float *d_well_depth, *d_crystal;
    int *d_bond_off, *d_bond_tgt;

    HIP_CHECK(hipMalloc(&d_energy, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_phase, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_spin, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_charge, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_coherence, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_coupling, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_observer, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_well_depth, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_crystal, N * sizeof(float)));
    HIP_CHECK(hipMalloc(&d_bond_off, (N + 1) * sizeof(int)));
    HIP_CHECK(hipMalloc(&d_bond_tgt, total_bonds * sizeof(int)));

    // Upload to GPU — the sea crosses the boundary
    HIP_CHECK(hipMemcpy(d_energy, h_energy, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_phase, h_phase, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_spin, h_spin, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_charge, h_charge, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_coherence, h_coherence, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_coupling, h_coupling, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_observer, h_observer, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_well_depth, h_well_depth, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_crystal, h_crystal, N * sizeof(float), hipMemcpyHostToDevice));
    HIP_CHECK(hipMemcpy(d_bond_off, h_bond_off, (N + 1) * sizeof(int), hipMemcpyHostToDevice));
    if (total_bonds > 0)
        HIP_CHECK(hipMemcpy(d_bond_tgt, h_bond_tgt, total_bonds * sizeof(int), hipMemcpyHostToDevice));

    printf("[sea] %d septits manifested on GPU\\n", N);

    // ══════════════════════════════════════════════
    // EMIT — Pre-pulse state
    // ══════════════════════════════════════════════
    printf("\\n{'═' * 60}\\n");
    printf("  EMIT: BEFORE PULSE\\n");
    printf("{'═' * 60}\\n");
    for (int i = 0; i < N; i++) {{
        int level = quantize(h_energy[i]);
        printf("  %s|%d> %-13s%s %-20s E=%7.3f P=%5.3f S=%+6.3f C=%+6.3f Co=%.3f Cu=%.3f Ob=%.3f\\n",
               LEVEL_COLORS[level], level, LEVEL_NAMES[level], RESET,
               names[i], h_energy[i], h_phase[i], h_spin[i], h_charge[i],
               h_coherence[i], h_coupling[i], h_observer[i]);
    }}
    printf("{'═' * 60}\\n");

    // ══════════════════════════════════════════════
    // PULSE — The 21 interactions on GPU
    // ══════════════════════════════════════════════
    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;
    float dt = 0.016f;

    printf("\\n[heartbeat] %d pulses × %d septits × 21 interactions\\n", {pulse_count}, N);
    for (int pulse = 0; pulse < {pulse_count}; pulse++) {{
        hipLaunchKernelGGL(pulse_kernel,
            dim3(gridSize), dim3(blockSize), 0, 0,
            d_energy, d_phase, d_spin, d_charge,
            d_coherence, d_coupling, d_observer,
            d_well_depth, d_crystal,
            d_bond_off, d_bond_tgt,
            N, dt);
        HIP_CHECK(hipDeviceSynchronize());
    }}
    printf("[heartbeat] complete\\n");

    // ══════════════════════════════════════════════
    // EMIT — Post-pulse state (download from GPU)
    // ══════════════════════════════════════════════
    HIP_CHECK(hipMemcpy(h_energy, d_energy, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_phase, d_phase, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_spin, d_spin, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_charge, d_charge, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_coherence, d_coherence, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_coupling, d_coupling, N * sizeof(float), hipMemcpyDeviceToHost));
    HIP_CHECK(hipMemcpy(h_observer, d_observer, N * sizeof(float), hipMemcpyDeviceToHost));

    printf("\\n{'═' * 60}\\n");
    printf("  EMIT: AFTER PULSE\\n");
    printf("{'═' * 60}\\n");
    for (int i = 0; i < N; i++) {{
        int level = quantize(h_energy[i]);
        printf("  %s|%d> %-13s%s %-20s E=%7.3f P=%5.3f S=%+6.3f C=%+6.3f Co=%.3f Cu=%.3f Ob=%.3f\\n",
               LEVEL_COLORS[level], level, LEVEL_NAMES[level], RESET,
               names[i], h_energy[i], h_phase[i], h_spin[i], h_charge[i],
               h_coherence[i], h_coupling[i], h_observer[i]);
    }}
    printf("{'═' * 60}\\n\\n");

    // ── Free GPU memory ──
    hipFree(d_energy); hipFree(d_phase); hipFree(d_spin);
    hipFree(d_charge); hipFree(d_coherence); hipFree(d_coupling);
    hipFree(d_observer); hipFree(d_well_depth); hipFree(d_crystal);
    hipFree(d_bond_off); hipFree(d_bond_tgt);

    return 0;
}}
"""

    def _generate_init_code(self, manifests: List[dict], couples: List[dict] = None) -> str:
        """Generate C code to initialize the SoA arrays + CSR bond topology."""
        if couples is None:
            couples = []

        lines = []
        n = len(manifests)
        if n == 0:
            n = 1

        # Build name→index map
        name_to_idx = {}
        for i, m in enumerate(manifests):
            name = m.get('name', f'septit_{i}')
            parts = name.split('.')
            sept_name = parts[-1] if len(parts) > 1 else parts[0]
            name_to_idx[sept_name] = i

        # Build adjacency list from couple declarations
        adj = [[] for _ in range(n)]
        for c in couples:
            a_full = c.get('a', '')
            b_full = c.get('b', '')
            a_name = a_full.split('.')[-1]
            b_name = b_full.split('.')[-1]
            if a_name in name_to_idx and b_name in name_to_idx:
                ai = name_to_idx[a_name]
                bi = name_to_idx[b_name]
                adj[ai].append(bi)
                adj[bi].append(ai)  # bonds are bidirectional

        # Build CSR arrays
        bond_offsets = [0]
        bond_targets = []
        for i in range(n):
            bond_targets.extend(adj[i])
            bond_offsets.append(len(bond_targets))
        total_bonds = len(bond_targets)
        if total_bonds == 0:
            total_bonds = 1  # avoid zero-size allocation

        lines.append(f"    const int N = {n};")
        lines.append(f"    const int total_bonds = {max(len(bond_targets), 1)};")
        lines.append(f"    const char* names[{n}];")

        for prop in ['energy', 'phase', 'spin', 'charge', 'coherence', 'coupling', 'observer', 'well_depth', 'crystal']:
            lines.append(f"    float h_{prop}[{n}];")

        # CSR bond offsets
        lines.append(f"    int h_bond_off[{n + 1}] = {{{', '.join(str(x) for x in bond_offsets)}}};")

        # CSR bond targets
        if bond_targets:
            lines.append(f"    int h_bond_tgt[{len(bond_targets)}] = {{{', '.join(str(x) for x in bond_targets)}}};")
        else:
            lines.append(f"    int h_bond_tgt[1] = {{0}};")

        # Emit septit property initialization
        for i, m in enumerate(manifests):
            name = m.get('name', f'septit_{i}')
            parts = name.split('.')
            sept_name = parts[-1] if len(parts) > 1 else parts[0]
            lines.append(f'    names[{i}] = "{sept_name}";')
            lines.append(f"    h_energy[{i}] = {float(m.get('energy', 0.0))}f;")
            lines.append(f"    h_phase[{i}] = {float(m.get('phase', 0.0))}f;")
            lines.append(f"    h_spin[{i}] = {float(m.get('spin', 0.0))}f;")
            lines.append(f"    h_charge[{i}] = {float(m.get('charge', 0.0))}f;")
            lines.append(f"    h_coherence[{i}] = {float(m.get('coherence', 1.0))}f;")
            lines.append(f"    h_coupling[{i}] = {float(m.get('coupling', 0.0))}f;")
            lines.append(f"    h_observer[{i}] = {float(m.get('observer', 0.0))}f;")
            lines.append(f"    h_well_depth[{i}] = 1.0f;")
            lines.append(f"    h_crystal[{i}] = 0.0f;")

        # Report bonds
        actual_bonds = sum(len(a) for a in adj)
        if actual_bonds > 0:
            lines.append(f'    printf("[couple] {actual_bonds} bonds in CSR topology\\n");')
            for c in couples:
                a_name = c.get('a', '?').split('.')[-1]
                b_name = c.get('b', '?').split('.')[-1]
                lines.append(f'    printf("  {a_name} <-> {b_name}\\n");')

        return '\n'.join(lines)

    def _emit_visual_host(self) -> str:
        """
        Emit a Raylib-based visual boundary — the Inner Eye.
        The sea state is rendered as a grid of glowing septits.
        Bonds are drawn as lines between coupled septits.
        Color = energy level. Brightness = coherence. Size = coupling.
        """
        # Collect manifests and couples for the visual
        manifests = []
        couples = []
        absorb_paths = []
        pulse_count = 0

        for node in self.nodes:
            if node.type == IRNodeType.MANIFEST:
                manifests.append(node.data)
            elif node.type == IRNodeType.COUPLE:
                couples.append(node.data)
            elif node.type == IRNodeType.ABSORB:
                absorb_paths.append(node.data['path'])
            elif node.type == IRNodeType.HEARTBEAT:
                for child in node.children:
                    if child.type == IRNodeType.PULSE:
                        pulse_count += 1
            elif node.type == IRNodeType.PULSE:
                pulse_count += 1

        if pulse_count == 0:
            pulse_count = 1

        # Compile-time absorb
        for path in absorb_paths:
            absorbed = self._compile_time_absorb(path)
            if absorbed:
                manifests.extend(absorbed)

        n = len(manifests)
        if n == 0:
            n = 1

        # Build name list for labels
        name_list = []
        for m in manifests:
            name = m.get('name', 'septit')
            parts = name.split('.')
            name_list.append(parts[-1] if len(parts) > 1 else parts[0])

        # Build name→idx for couple resolution
        name_to_idx = {}
        for i, nm in enumerate(name_list):
            name_to_idx[nm] = i

        # Build couple pairs as index pairs
        couple_pairs = []
        for c in couples:
            a_name = c.get('a', '').split('.')[-1]
            b_name = c.get('b', '').split('.')[-1]
            if a_name in name_to_idx and b_name in name_to_idx:
                couple_pairs.append((name_to_idx[a_name], name_to_idx[b_name]))

        # Generate init arrays
        init_lines = []
        for i, m in enumerate(manifests):
            init_lines.append(f'    energy[{i}] = {float(m.get("energy", 0.1))}f;')
            init_lines.append(f'    phase[{i}] = {float(m.get("phase", 0.0))}f;')
            init_lines.append(f'    coherence[{i}] = {float(m.get("coherence", 0.3))}f;')
            init_lines.append(f'    coupling[{i}] = {float(m.get("coupling", 0.0))}f;')
        init_code = '\n'.join(init_lines)

        # Name array
        name_inits = '\n'.join(f'    names[{i}] = "{nm}";' for i, nm in enumerate(name_list))

        # Bond pairs
        bond_inits = '\n'.join(
            f'    bonds[{i*2}] = {a}; bonds[{i*2+1}] = {b};'
            for i, (a, b) in enumerate(couple_pairs)
        )
        num_bonds = len(couple_pairs)

        return f"""// ═══════════════════════════════════════════════════════════
// ZestC Visual Boundary — The Inner Eye
// Generated by zestc.py
//
// boundary.display: the sea rendered as light
// Each septit is a glowing circle. Color = energy level.
// Bonds are lines. Brightness = coherence. Size = coupling.
// ═══════════════════════════════════════════════════════════

#include "raylib.h"
#include <cstdio>
#include <cstring>
#include <cmath>

#define N {n}
#define NUM_BONDS {num_bonds}
#define PULSE_COUNT {pulse_count}

// Septit level colors — photon emission spectrum
static Color level_color(float energy, float coherence) {{
    int level;
    if (energy >= 2.00f) level = 7;
    else if (energy >= 1.00f) level = 6;
    else if (energy >= 0.75f) level = 5;
    else if (energy >= 0.50f) level = 4;
    else if (energy >= 0.30f) level = 3;
    else if (energy >= 0.15f) level = 2;
    else level = 1;

    unsigned char alpha = (unsigned char)(coherence * 255.0f);
    switch (level) {{
        case 1: return (Color){{ 40,  40,  40, alpha }};   // DORMANT - dark
        case 2: return (Color){{  0,   0, 170, alpha }};   // STIRRING - deep blue
        case 3: return (Color){{  0, 170,   0, alpha }};   // AWARE - green
        case 4: return (Color){{255, 170,   0, alpha }};   // ACTIVE - amber
        case 5: return (Color){{255, 215,   0, alpha }};   // FOCUSED - golden
        case 6: return (Color){{  0, 255, 255, alpha }};   // BLAZING - cyan
        case 7: return (Color){{255, 255, 255, alpha }};   // TRANSCENDENT - white
        default: return (Color){{ 20,  20,  20, alpha }};
    }}
}}

int main() {{
    // ── Sea data ──
    float energy[N], phase[N], coherence[N], coupling[N];
    const char* names[N];
    int bonds[NUM_BONDS * 2 > 0 ? NUM_BONDS * 2 : 1];

    // ── Initialize from compiled sea ──
{init_code}
{name_inits}
{bond_inits}

    // ── Compute grid layout ──
    int cols = (int)ceilf(sqrtf((float)N));
    int rows = (N + cols - 1) / cols;
    int cell_w = 1600 / (cols > 0 ? cols : 1);
    int cell_h = 900 / (rows > 0 ? rows : 1);
    int margin = 10;

    // ── Raylib init ──
    InitWindow(1600, 900, "ZestC — Wave Sea Boundary");
    SetTargetFPS(60);

    int pulse = 0;
    int frame = 0;
    int auto_pulse = 1;

    while (!WindowShouldClose()) {{
        // ── Auto-pulse every 6 frames (continuous — the sea is alive) ──
        if (auto_pulse && frame % 6 == 0) {{
            float dt = 0.016f;

            // Snapshot energy for neighbor reads
            float snap_e[N], snap_p[N];
            for (int i = 0; i < N; i++) {{ snap_e[i] = energy[i]; snap_p[i] = phase[i]; }}

            for (int i = 0; i < N; i++) {{
                float E  = snap_e[i];
                float P  = snap_p[i];
                float Co = coherence[i];
                float Cu = coupling[i];

                // 1. ENERGY × PHASE: wave interference
                float dE = cosf(P) * E * 0.01f;
                // 2. ENERGY × COUPLING: directional flow
                dE += Cu * E * 0.003f;
                // Phase rotation (spin-driven)
                float dP = 0.5f * dt * 3.14159f;
                dP *= (0.5f + 0.5f * Co);

                // 5. ENERGY × COUPLING: neighbor sharing via bonds
                for (int b = 0; b < NUM_BONDS; b++) {{
                    int a = bonds[b * 2];
                    int bi_idx = bonds[b * 2 + 1];
                    if (a == i) {{
                        float neighbor_e = snap_e[bi_idx];
                        dE += Cu * (neighbor_e - E) * 0.01f;
                        dP += Cu * (snap_p[bi_idx] - P) * 0.05f;
                    }} else if (bi_idx == i) {{
                        float neighbor_e = snap_e[a];
                        dE += Cu * (neighbor_e - E) * 0.01f;
                        dP += Cu * (snap_p[a] - P) * 0.05f;
                    }}
                }}

                // Coherence: slow decay with floor at 0.1
                float dCo = -0.0005f * dt;
                dCo += Cu * 0.001f * dt;  // coupling preserves coherence

                energy[i]    = fmaxf(E + dE, 0.0f);
                phase[i]     = fmodf(P + dP, 6.28318f);
                coherence[i] = fminf(fmaxf(Co + dCo, 0.1f), 1.0f);
            }}
            pulse++;
        }}
        frame++;

        if (IsKeyPressed(KEY_SPACE)) auto_pulse = !auto_pulse;
        if (IsKeyPressed(KEY_R)) {{
            // Reset
{init_code}
            pulse = 0;
        }}

        BeginDrawing();
        ClearBackground((Color){{ 10, 10, 15, 255 }});

        // ── Draw bonds ──
        for (int b = 0; b < NUM_BONDS; b++) {{
            int a = bonds[b * 2];
            int bi = bonds[b * 2 + 1];
            int ax = (a % cols) * cell_w + cell_w / 2;
            int ay = (a / cols) * cell_h + cell_h / 2;
            int bx = (bi % cols) * cell_w + cell_w / 2;
            int by = (bi / cols) * cell_h + cell_h / 2;
            DrawLine(ax, ay, bx, by, (Color){{ 60, 60, 80, 120 }});
        }}

        // ── Draw septits ──
        for (int i = 0; i < N; i++) {{
            int cx = (i % cols) * cell_w + cell_w / 2;
            int cy = (i / cols) * cell_h + cell_h / 2;
            float radius = 8.0f + coupling[i] * 12.0f;
            Color col = level_color(energy[i], coherence[i]);

            // Glow
            DrawCircle(cx, cy, radius + 4, (Color){{ col.r, col.g, col.b, (unsigned char)(col.a / 3) }});
            // Core
            DrawCircle(cx, cy, radius, col);

            // Phase indicator (rotating line)
            float px = cx + cosf(phase[i]) * (radius + 6);
            float py = cy + sinf(phase[i]) * (radius + 6);
            DrawLine(cx, cy, (int)px, (int)py, (Color){{ 200, 200, 200, 80 }});

            // Label
            if (cell_w > 30) {{
                DrawText(names[i], cx - 20, cy + (int)radius + 4, 8, (Color){{ 150, 150, 150, 200 }});
            }}
        }}

        // ── HUD ──
        DrawText("ZestC Wave Sea — The Inner Eye", 10, 10, 20, WHITE);
        char buf[128];
        snprintf(buf, 128, "Septits: %d  Bonds: %d  Pulse: %d", N, NUM_BONDS, pulse);
        DrawText(buf, 10, 35, 16, LIGHTGRAY);
        DrawText("[SPACE] pause  [R] reset  [ESC] exit", 10, 55, 14, DARKGRAY);

        // ── Level legend ──
        int ly = 870;
        DrawCircle(200, ly, 5, (Color){{ 40,  40,  40, 255 }});  DrawText("DORMANT", 210, ly-5, 10, GRAY);
        DrawCircle(300, ly, 5, (Color){{  0,   0, 170, 255 }});  DrawText("STIRRING", 310, ly-5, 10, GRAY);
        DrawCircle(420, ly, 5, (Color){{  0, 170,   0, 255 }});  DrawText("AWARE", 430, ly-5, 10, GRAY);
        DrawCircle(520, ly, 5, (Color){{255, 170,   0, 255 }});  DrawText("ACTIVE", 530, ly-5, 10, GRAY);
        DrawCircle(630, ly, 5, (Color){{255, 215,   0, 255 }});  DrawText("FOCUSED", 640, ly-5, 10, GRAY);
        DrawCircle(740, ly, 5, (Color){{  0, 255, 255, 255 }});  DrawText("BLAZING", 750, ly-5, 10, GRAY);
        DrawCircle(850, ly, 5, (Color){{255, 255, 255, 255 }});  DrawText("TRANSCENDENT", 860, ly-5, 10, GRAY);

        EndDrawing();
    }}

    CloseWindow();
    return 0;
}}
"""

    def _emit_build_script(self, has_display: bool = False) -> str:
        """Emit the build script that compiles kernel + host into native binary."""
        visual_section = ""
        if has_display:
            # Find raylib in the FadrielApp build
            base = os.path.dirname(self.base_dir)  # 5 Layers Contemplations
            raylib_path = os.path.join(
                base, "FadrielApp/build/_deps/raylib-build/raylib"
            )
            visual_section = f"""
echo "[ZestC] Compiling visual boundary (Raylib)..."
RAYLIB_INC="{raylib_path}/include"
RAYLIB_LIB="{raylib_path}"
g++ -O2 -I"$RAYLIB_INC" zestc_visual.cpp -L"$RAYLIB_LIB" -lraylib -lm -lpthread -ldl -lrt -lX11 -o zestc_visual 2>&1
echo "[ZestC] Visual boundary: ./zestc_visual"
"""

        return f"""#!/bin/bash
# ═══════════════════════════════════════════════════════════
# ZestC Build Script — Generated by zestc.py
# Compiles the wave sea kernel + host boundary into one binary.
# ═══════════════════════════════════════════════════════════

set -e
ROCM="{ROCM_PATH}"
LLC="$ROCM/llvm/bin/llc"
HIPCC="$ROCM/bin/hipcc"

echo "[ZestC] Compiling → AMDGPU {GPU_TARGET}"

# Single-file compile: hipcc handles kernel (GPU) + host (CPU) split
$HIPCC --offload-arch={GPU_TARGET} -O2 zestc_host.hip -o zestc_out 2>&1

echo "[ZestC] Build complete: ./zestc_out"
{visual_section}
# Optional: verify LLVM IR also compiles to ISA
if [ -f pulse_kernel.ll ]; then
    echo "[ZestC] Verifying LLVM IR → AMDGPU ISA..."
    $LLC -march=amdgcn -mcpu={GPU_TARGET} -filetype=obj \\
         pulse_kernel.ll -o pulse_kernel.o 2>&1 && echo "[ZestC] ISA verification: OK"
fi

echo ""
echo "To run: ./zestc_out"
{('echo "To see:  ./zestc_visual"' if has_display else '')}
"""


# ══════════════════════════════════════════════════════════════
# MAIN — The entry point
# ══════════════════════════════════════════════════════════════

def main():
    if len(sys.argv) < 3:
        print("ZestC Bootstrap Compiler — Phase 0")
        print("The primitive is a wave, not a bit.")
        print()
        print("Usage:")
        print("  python3 zestc.py run   <file.zc>              # interpret")
        print("  python3 zestc.py emit  <file.zc> [output_dir] # emit LLVM IR + host")
        print("  python3 zestc.py build <file.zc> [output_dir] # emit + compile")
        sys.exit(0)

    mode = sys.argv[1]
    filepath = sys.argv[2]
    output_dir = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
        os.path.dirname(os.path.abspath(filepath)), "build_zc"
    )
    output_dir = os.path.abspath(output_dir)

    if not os.path.exists(filepath):
        print(f"[ZestC] ERROR: file not found: {filepath}")
        sys.exit(1)

    with open(filepath, 'r', encoding='utf-8') as f:
        source = f.read()

    base_dir = os.path.dirname(os.path.abspath(filepath))

    # Stage 1: Lex
    tokens = lex(source, filepath)

    # Stage 2: Parse → Wave IR
    parser = Parser(tokens, filepath)
    ir = parser.parse()

    # Stage 3: Execute or Compile
    if mode == 'run':
        print(f"\n{'═' * 60}")
        print(f"  ZestC Bootstrap — {filepath}")
        print(f"  {len(ir)} IR nodes")
        print(f"{'═' * 60}\n")
        interpreter = Interpreter(ir, base_dir)
        interpreter.run()

    elif mode in ('emit', 'build'):
        print(f"\n{'═' * 60}")
        print(f"  ZestC Compiler — {filepath}")
        print(f"  {len(ir)} IR nodes → LLVM IR → AMDGPU {GPU_TARGET}")
        print(f"{'═' * 60}\n")
        codegen = LLVMCodegen(ir, base_dir, output_dir)
        codegen.emit()

        if mode == 'build':
            print(f"\n[ZestC] Building...")
            import subprocess
            result = subprocess.run(
                ['bash', os.path.join(output_dir, 'build.sh')],
                cwd=output_dir,
                capture_output=True, text=True
            )
            print(result.stdout)
            if result.returncode != 0:
                print(f"[ZestC] Build failed:\n{result.stderr}")
                sys.exit(1)
            print(f"[ZestC] Binary ready: {os.path.join(output_dir, 'zestc_out')}")
    else:
        print(f"[ZestC] Unknown mode '{mode}'. Use 'run', 'emit', or 'build'.")
        sys.exit(1)


if __name__ == '__main__':
    main()

